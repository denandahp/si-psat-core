const dotenv = require('dotenv');
const format_date = require('../../models/param/utils.js');
var fs = require('fs');
const multer = require('multer');
const path = require('path');
const pool = require('../../libs/okkp_db.js')

dotenv.config();

let schema = 'static'
let db_header_import = schema + '.header_import'
let db_komoditas = schema + '.komoditas'

exports.param = () => {
    var date = format_date.time_format();
    var dir;
    const diskStorage = multer.diskStorage({
        // konfigurasi folder penyimpanan file
        destination: function(req, file, cb) {
            console.log(file)
            if(process.env.NODE_ENV == 'LOKAL'){
                dir = path.join(process.cwd(), `/media/import/${date}/`);
            } else {
                dir = `si-psat-core/media/import/${date}/`;
            };

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            cb(null, dir);
        },
        // konfigurasi penamaan file yang unik
        filename: function(req, file, cb) {
            let name = file.originalname.replace(path.extname(file.originalname), '_').replace(/ /g, '_').toLowerCase()
            cb(
                null, name + date + path.extname(file.originalname)
            );
        },
    });

    return multer({
        storage: diskStorage,
    }).single('import-excel')
}

exports.validation_headers = async (headers, body) => {
    let header_imports = await pool.query('SELECT * FROM ' + db_header_import + 
                                          ` WHERE jenis_registrasi_id=${body.registrasi_id} ORDER BY jenis_registrasi_id ASC`);
    let fix_headers = header_imports.rows[0].headers
    let is_same = headers.length == fix_headers.length && fix_headers.every(function(element, index) {
        return element === headers[index]; 
    });
    if(is_same == true){
        return is_same;
    } else{
        throw new Error('Format judul kolom tidak sesuai dengan contoh template.')
    }
}

exports.mapping_excel = async (raw_data, body) => {
    let komoditas_dict = {}
    let komoditas = await pool.query(`SELECT * FROM ${db_komoditas}`)
    for(index in komoditas){
        komoditas_dict[String(komoditas[index].komoditas)] = {'id' : komoditas[index].id, 'Nama': komoditas[index].komoditas}
    }

    let clean_data = []
    for(row in raw_data){

        if (komoditas_dict[String(komoditas)] !== null){
            komoditas = komoditas_dict[String(komoditas)].id
        }

        clean_data.push([2, row[2], row[3], row[4], komoditas, nama_psat, row[7], 
                         row[8], row[9], row[10], row[11], row[12]]
        )
    }
    return clean_data
}