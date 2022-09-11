const dotenv = require('dotenv');
const format_date = require('../../models/param/utils.js');
var fs = require('fs');
const multer = require('multer');
const path = require('path');
const pool = require('../../libs/mysql.js');


dotenv.config();

exports.param = () => {
    var date = format_date.time_format();
    var dir;
    const diskStorage = multer.diskStorage({
        // konfigurasi folder penyimpanan file
        destination: function(req, file, cb) {
            if(process.env.NODE_ENV == 'LOKAL'){
                dir = path.join(process.cwd(), `/media/${date}/`);
            } else {
                dir = `si-psat-core/media/${date}/`;
            };

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            cb(null, dir);
        },
        // konfigurasi penamaan file yang unik
        filename: function(req, file, cb) {
            let name = 'FILE_IMPORT_'
            cb(
                null, name + date + path.extname(file.originalname)
            );
        },
    });

    return multer({
        storage: diskStorage,
    }).single('import-excel')
}

exports.validation_headers = (headers) => {
    console.log(headers)
    let fix_headers = ['No', 'Nama Unit Usaha', 'Kab/Kota', 'Alamat Kantor', 'Alamat Unit Penanganan',
                       'Komoditas Utama', 'Nama PSAT', 'Nama Ilmiah', 'Kemasan dan Berat Bersih',
                       'Nama Dagang/Merk', 'Nomor Registrasi', 'Label Hijau/Putih', 'Tanggal Penerbitan Sertifikat']
    let is_same = headers.length == fix_headers.length && fix_headers.every(function(element, index) {
        return element === headers[index]; 
    });
    if(is_same == true){
        return is_same;
    } else{
        throw new Error('Format judul kolom tidak sesuai dengan contoh template.')
    }
}

exports.mapping_excel = async (raw_data) => {
    let komoditas_dict = {}
    let komoditas = await pool.query('SELECT * FROM komoditas')
    for(index in komoditas){
        komoditas_dict[String(komoditas[index].komoditas)] = {'id' : komoditas[index].id, 'Nama': komoditas[index].komoditas}
    }

    let clean_data = []
    for(row in raw_data){
        let no = row[0], nama_unit = row[1], kota = row[2], alamat_kantor = row[3], alamat_unit = row[4],
            komoditas = row[5], nama_psat = row[6], nama_ilmiah = row[7], kemasan = row[8], merk = row[9],
            no_registrasi = row[10], label = row[11], tanggal_penerbitan = row[12];

        if (komoditas_dict[String(komoditas)] !== null){
            komoditas = komoditas_dict[String(komoditas)].id
        }

        clean_data.push([2, row[2], row[3], row[4], komoditas, nama_psat, row[7], 
                         row[8], row[9], row[10], row[11], row[12]]
        )
    }
    return clean_data
}