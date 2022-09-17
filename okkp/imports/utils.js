const constant = require('./constant.js')
const dotenv = require('dotenv');
var format = require('pg-format');
const format_date = require('../../models/param/utils.js');
var fs = require('fs');
const multer = require('multer');
const path = require('path');
const pool = require('../../libs/okkp_db.js')

dotenv.config();

const schema_static = 'static'
const db_header_import = schema_static + '.header_import'
const db_komoditas = schema_static + '.komoditas'
const db_jenis_hc = schema_static + '.jenis_hc'
const db_jenis_registrasi = schema_static + '.jenis_registrasi';
const db_jenis_sertifikat = schema_static + '.jenis_sertifikat';

const schema_regis = 'register';
const db_registrations = schema_regis + '.registrasi';


exports.param = () => {
    var date = format_date.time_format(), dir;
    const diskStorage = multer.diskStorage({
        // konfigurasi folder penyimpanan file
        destination: function(req, file, cb) {
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
    return is_same;
}

exports.mapping_komoditas_dict = async () => {
    let komoditas_dict = {}
    let komoditas = await pool.query(`select * from ${db_komoditas}`)
    for(index in komoditas.rows){
        komoditas_dict[komoditas.rows[index].nama] = {'id' : komoditas.rows[index].id, 'Nama': komoditas.rows[index].nama}
    }

    return komoditas_dict
}

exports.mapping_jenis_sertif_dict = async () => {
    let jenis_sertif_dict = {}
    let jenis_sertif = await pool.query(`select * from ${db_jenis_sertifikat}`)
    for(index in jenis_sertif.rows){
        jenis_sertif_dict[jenis_sertif.rows[index].nama] = {'id' : jenis_sertif.rows[index].id, 'Nama': jenis_sertif.rows[index].nama}
    }

    return jenis_sertif_dict
}

exports.mapping_no_registrasi_dict = async (raw_data, index_no_regis, jenis_registrasi_id) => {
    // Mapping data dan pengecekan nomor registrasi berdasarkan nomor registrasi
    let regis_array = []
    for(index in raw_data){
        regis_array.push(raw_data[index][index_no_regis].toString())
    }
    let no_regis = await pool.query(format(`select no_registration from ${db_registrations} `+
                                           `WHERE jenis_registrasi_id=${jenis_registrasi_id} AND no_registration IN (%L)`, regis_array))
    let no_regis_dict = {};
    for(index in no_regis.rows){
        no_regis_dict[no_regis.rows[index].no_registration] = true
    }
    return no_regis_dict
}

exports.mapping_pd_uk = async (raw_data, body, user) => {
    let jenis_registrasi_id = body.registrasi_id, 
        provinsi_id = body.provinsi_id,
        modified_by = user.email,
        error_msg = {};

    let komoditas_dict = await this.mapping_komoditas_dict()
    let no_regis_dict = await this.mapping_no_registrasi_dict(raw_data, 10, jenis_registrasi_id)

    // Get key dari constant
    let field_registrasi = await constant.field_db(jenis_registrasi_id)
    let key = field_registrasi.toString()
    let value = [], wrong_format = [], line =1;

    // Mapping data
    for(index in raw_data){
        let no = raw_data[index][0],
            unit_usaha = raw_data[index][1],
            kota = raw_data[index][2],
            alamat_kantor = raw_data[index][3],
            alamat_unit = raw_data[index][4],
            nama_psat = raw_data[index][6],
            nama_ilmiah = raw_data[index][7],
            kemasan = raw_data[index][8],
            merk = raw_data[index][9],
            label = raw_data[index][11],
            terbit_sertifikat = raw_data[index][12],
            komoditas_id, err_msg;

        let komoditas = komoditas_dict[raw_data[index][5]]
        if (komoditas == undefined || komoditas == null){
            err_msg = 'Format Komoditas Salah';
            error_msg[err_msg] = true
            raw_data[index].push(err_msg, line);
            wrong_format.push(raw_data[index]);
            continue;
        }else {
            komoditas_id = komoditas.id
        }

        let no_registration = no_regis_dict[raw_data[index][10]]
        if (no_registration){
            err_msg = 'No Registrasi sudah terdaftar';
            error_msg[err_msg] = true
            raw_data[index].push(err_msg, line);
            wrong_format.push(raw_data[index]);
            continue;
        }else{
            no_registration = raw_data[index][10]
        }

        value.push(
            [jenis_registrasi_id, unit_usaha, kota, alamat_kantor, alamat_unit, komoditas_id, nama_psat, 
             nama_ilmiah, kemasan, merk, no_registration, label, terbit_sertifikat, provinsi_id, modified_by]
        )
        line = line++;
    }

    if(value.length === 0){
        let jenis_registrasi = await pool.query('SELECT * FROM ' + db_jenis_registrasi + ` WHERE id=${jenis_registrasi_id}`);

        throw ({pesan: error_msg, 
                code: '401' ,
                jenis_registrasi: jenis_registrasi.rows[0].nama,
                details: wrong_format});
    }

    return {wrong_format, key, value}
}

exports.izin_edar_psat_pd = async (raw_data, body, user) => {
    let jenis_registrasi_id = body.registrasi_id, 
        provinsi_id = body.provinsi_id,
        modified_by = user.email,
        error_msg = {};

    let komoditas_dict = await this.mapping_komoditas_dict()
    let no_regis_dict = await this.mapping_no_registrasi_dict(raw_data, 10, jenis_registrasi_id)

    // Get key dari constant
    let field_registrasi = await constant.field_db(jenis_registrasi_id)
    let key = field_registrasi.toString()
    let value = [], wrong_format = [], line =1;

    // Mapping data
    for(index in raw_data){
        let no = raw_data[index][0],
            unit_usaha = raw_data[index][1],
            kota = raw_data[index][2],
            alamat_kantor = raw_data[index][3],
            alamat_unit = raw_data[index][4],
            nama_psat = raw_data[index][6],
            nama_ilmiah = raw_data[index][7],
            kemasan = raw_data[index][8],
            merk = raw_data[index][9],
            terbit_sertifikat = raw_data[index][11],
            komoditas_id, err_msg;

        let komoditas = komoditas_dict[raw_data[index][5]]
        if (komoditas == undefined || komoditas == null){
            err_msg = 'Format Komoditas Salah';
            error_msg[err_msg] = true
            raw_data[index].push(err_msg, line);
            wrong_format.push(raw_data[index]);
            continue;
        }else {
            komoditas_id = komoditas.id
        }

        let no_registration = no_regis_dict[raw_data[index][10]]
        if (no_registration){
            err_msg = 'No Registrasi sudah terdaftar';
            error_msg[err_msg] = true
            raw_data[index].push(err_msg, line);
            wrong_format.push(raw_data[index]);
            continue;
        }else{
            no_registration = raw_data[index][10]
        }

        value.push(
            [jenis_registrasi_id, unit_usaha, kota, alamat_kantor, alamat_unit, komoditas_id, nama_psat, 
             nama_ilmiah, kemasan, merk, no_registration, terbit_sertifikat, provinsi_id, modified_by]
        )
        line = line++;
    }

    if(value.length === 0){
        let jenis_registrasi = await pool.query('SELECT * FROM ' + db_jenis_registrasi + ` WHERE id=${jenis_registrasi_id}`);

        throw ({pesan: Object.keys(error_msg), 
                code: '401' ,
                jenis_registrasi: jenis_registrasi.rows[0].nama,
                details: wrong_format});
    }

    return {wrong_format, key, value}
}

exports.packing_house = async (raw_data, body, user) => {
    let jenis_registrasi_id = body.registrasi_id, 
        provinsi_id = body.provinsi_id,
        modified_by = user.email,
        error_msg = {};

    let komoditas_dict = await this.mapping_komoditas_dict()
    let no_regis_dict = await this.mapping_no_registrasi_dict(raw_data, 10, jenis_registrasi_id)

    // Get key dari constant
    let field_registrasi = await constant.field_db(jenis_registrasi_id)
    let key = field_registrasi.toString()
    let value = [], wrong_format = [], line =1;

    // Mapping data
    for(index in raw_data){
        let no = raw_data[index][0],
            unit_usaha = raw_data[index][1],
            kota = raw_data[index][2],
            alamat_kantor = raw_data[index][3],
            alamat_unit = raw_data[index][4],
            ruang_lingkup = raw_data[index][5],
            luas_lahan = raw_data[index][6],
            nama_psat = raw_data[index][8],
            nama_ilmiah = raw_data[index][9],
            terbit_sertifikat = raw_data[index][11],
            komoditas_id, err_msg;

        let komoditas = komoditas_dict[raw_data[index][7]]
        if (komoditas == undefined || komoditas == null){
            err_msg = 'Format Komoditas Salah';
            error_msg[err_msg] = true
            raw_data[index].push(err_msg, line);
            wrong_format.push(raw_data[index]);
            continue;
        }else {
            komoditas_id = komoditas.id
        }

        let no_registration = no_regis_dict[raw_data[index][10]]
        if (no_registration){
            err_msg = 'No Registrasi sudah terdaftar';
            error_msg[err_msg] = true
            raw_data[index].push(err_msg, line);
            wrong_format.push(raw_data[index]);
            continue;
        }else{
            no_registration = raw_data[index][10]
        }

        value.push(
            [jenis_registrasi_id, unit_usaha, kota, alamat_kantor, alamat_unit, ruang_lingkup, luas_lahan, komoditas_id, nama_psat, 
             nama_ilmiah, no_registration, terbit_sertifikat, provinsi_id, modified_by]
        )
        line = line++;
    }

    if(value.length === 0){
        let jenis_registrasi = await pool.query('SELECT * FROM ' + db_jenis_registrasi + ` WHERE id=${jenis_registrasi_id}`);

        throw ({pesan: error_msg, 
                code: '401' ,
                jenis_registrasi: jenis_registrasi.rows[0].nama,
                details: wrong_format});
    }

    return {wrong_format, key, value}
}

exports.health_certificate = async (raw_data, body, user) => {
    let jenis_registrasi_id = body.registrasi_id, 
        provinsi_id = body.provinsi_id,
        modified_by = user.email,
        error_msg = {};

    let komoditas_dict = await this.mapping_komoditas_dict()
    let no_regis_dict = await this.mapping_no_registrasi_dict(raw_data, 7, jenis_registrasi_id)

    let jenis_hc_dict = {}
    let jenis_hc_query = await pool.query(`select * from ${db_jenis_hc}`)
    for(index in jenis_hc_query.rows){
        jenis_hc_dict[jenis_hc_query.rows[index].nama] = {'id' : jenis_hc_query.rows[index].id, 'Nama': jenis_hc_query.rows[index].nama}
    }

    // Get key dari constant
    let field_registrasi = await constant.field_db(jenis_registrasi_id)
    let key = field_registrasi.toString()
    let value = [], wrong_format = [], line =1;

    // Mapping data
    for(index in raw_data){
        let no = raw_data[index][0],
            unit_usaha = raw_data[index][1],
            alamat_kantor = raw_data[index][3],
            identitas_lot = raw_data[index][5],
            negara_tujuan = raw_data[index][6],
            terbit_sertifikat = raw_data[index][8],
            komoditas_id, jenis_hc_id, err_msg;

        let jenis_hc = jenis_hc_dict[raw_data[index][2]]
        if (jenis_hc == undefined || jenis_hc == null){
            err_msg = 'Format jenis sertifikat salah';
            error_msg[err_msg] = true
            raw_data[index].push(err_msg, line);
            wrong_format.push(raw_data[index]);
            continue;
        }else {
            jenis_hc_id = jenis_hc.id
        }

        let komoditas = komoditas_dict[raw_data[index][4]]
        if (komoditas == undefined || komoditas == null){
            err_msg = 'Format Komoditas Salah';
            error_msg[err_msg] = true
            raw_data[index].push(err_msg, line);
            wrong_format.push(raw_data[index]);
            continue;
        }else {
            komoditas_id = komoditas.id
        }

        let no_registration = no_regis_dict[raw_data[index][7]]
        if (no_registration){
            err_msg = 'No Registrasi sudah terdaftar';
            error_msg[err_msg] = true
            raw_data[index].push(err_msg, line);
            wrong_format.push(raw_data[index]);
            continue;
        }else{
            no_registration = raw_data[index][7]
        }

        value.push(
            [jenis_registrasi_id, unit_usaha, jenis_hc_id, alamat_kantor, komoditas_id, identitas_lot, 
             negara_tujuan, no_registration, terbit_sertifikat, provinsi_id, modified_by]
        )
        line = line++;
    }

    if(value.length === 0){
        let jenis_registrasi = await pool.query('SELECT * FROM ' + db_jenis_registrasi + ` WHERE id=${jenis_registrasi_id}`);

        throw ({pesan: Object.keys(error_msg), 
                code: '401' ,
                jenis_registrasi: jenis_registrasi.rows[0].nama,
                details: wrong_format});
    }
    return {wrong_format, key, value}
}

exports.sppb_psat_provinsi = async (raw_data, body, user) => {
    let jenis_registrasi_id = body.registrasi_id, 
        provinsi_id = body.provinsi_id,
        modified_by = user.email,
        error_msg = {};

    let komoditas_dict = await this.mapping_komoditas_dict()
    let no_regis_dict = await this.mapping_no_registrasi_dict(raw_data, 10, jenis_registrasi_id)

    // Get key dari constant
    let field_registrasi = await constant.field_db(jenis_registrasi_id)
    let key = field_registrasi.toString()
    let value = [], wrong_format = [], line =1;

    // Mapping data
    for(index in raw_data){
        let no = raw_data[index][0],
            unit_usaha = raw_data[index][1],
            alamat_kantor = raw_data[index][2],
            alamat_unit = raw_data[index][3],
            ruang_lingkup = raw_data[index][4],
            nama_psat = raw_data[index][6],
            nama_ilmiah = raw_data[index][7],
            kemasan = raw_data[index][8],
            merk = raw_data[index][9],
            terbit_sertifikat = raw_data[index][11],
            komoditas_id, err_msg;

        let komoditas = komoditas_dict[raw_data[index][5]]
        if (komoditas == undefined || komoditas == null){
            err_msg = 'Format Komoditas Salah';
            error_msg[err_msg] = true
            raw_data[index].push(err_msg, line);
            wrong_format.push(raw_data[index]);
            continue;
        }else {
            komoditas_id = komoditas.id
        }

        let no_registration = no_regis_dict[raw_data[index][10]]
        if (no_registration){
            err_msg = 'No Registrasi sudah terdaftar';
            error_msg[err_msg] = true
            raw_data[index].push(err_msg, line);
            wrong_format.push(raw_data[index]);
            continue;
        }else{
            no_registration = raw_data[index][10]
        }

        value.push(
            [jenis_registrasi_id, unit_usaha, alamat_kantor, alamat_unit, ruang_lingkup, komoditas_id, nama_psat, 
             nama_ilmiah, kemasan, merk, no_registration, terbit_sertifikat, provinsi_id, modified_by]
        )
        line = line++;
    }

    if(value.length === 0){
        let jenis_registrasi = await pool.query('SELECT * FROM ' + db_jenis_registrasi + ` WHERE id=${jenis_registrasi_id}`);

        throw ({pesan: error_msg, 
                code: '401' ,
                jenis_registrasi: jenis_registrasi.rows[0].nama,
                details: wrong_format});
    }

    return {wrong_format, key, value}
}

exports.sertifikasi_prima = async (raw_data, body, user) => {
    let jenis_registrasi_id = body.registrasi_id, 
        provinsi_id = body.provinsi_id,
        modified_by = user.email,
        error_msg = {};

    let komoditas_dict = await this.mapping_komoditas_dict()
    let jenis_sertif_dict = await this.mapping_jenis_sertif_dict()
    let no_regis_dict = await this.mapping_no_registrasi_dict(raw_data, 10, jenis_registrasi_id)

    // Get key dari constant
    let field_registrasi = await constant.field_db(jenis_registrasi_id)
    let key = field_registrasi.toString()
    let value = [], wrong_format = [], line =1;

    // Mapping data
    for(index in raw_data){
        let no = raw_data[index][0],
            unit_usaha = raw_data[index][1],
            kota = raw_data[index][2],
            alamat_kantor = raw_data[index][3],
            alamat_unit = raw_data[index][4],
            nama_psat = raw_data[index][6],
            nama_ilmiah = raw_data[index][7],
            merk = raw_data[index][8],
            terbit_sertifikat = raw_data[index][11],
            komoditas_id, jenis_sertifikat_id, err_msg;

        let komoditas = komoditas_dict[raw_data[index][5]]
        if (komoditas == undefined || komoditas == null){
            err_msg = 'Format Komoditas Salah';
            error_msg[err_msg] = true
            raw_data[index].push(err_msg, line);
            wrong_format.push(raw_data[index]);
            continue;
        }else {
            komoditas_id = komoditas.id
        }

        let jenis_sertif = jenis_sertif_dict[raw_data[index][9]]
        if (jenis_sertif == undefined || jenis_sertif == null){
            err_msg = 'Format Prima 1/2/3 Salah';
            error_msg[err_msg] = true
            raw_data[index].push(err_msg, line);
            wrong_format.push(raw_data[index]);
            continue;
        }else {
            jenis_sertifikat_id = jenis_sertif.id
        }

        let no_registration = no_regis_dict[raw_data[index][10]]
        if (no_registration){
            err_msg = 'No Registrasi sudah terdaftar';
            error_msg[err_msg] = true
            raw_data[index].push(err_msg, line);
            wrong_format.push(raw_data[index]);
            continue;
        }else{
            no_registration = raw_data[index][10]
        }
        ['jenis_registrasi_id', 'unit_usaha', 'kota', 'alamat_kantor', 'alamat_unit', 'komoditas_id', 'nama_psat', 'nama_ilmiah', 'merk', 'jenis_sertifikat_id', 'no_registration', 'terbit_sertifikat', 'provinsi_id', 'modified_by']

        value.push(
            [jenis_registrasi_id, unit_usaha, kota, alamat_kantor, alamat_unit, komoditas_id, nama_psat, 
             nama_ilmiah, merk, jenis_sertifikat_id, no_registration, terbit_sertifikat, provinsi_id, modified_by]
        )
        line = line++;
    }

    if(value.length === 0){
        let jenis_registrasi = await pool.query('SELECT * FROM ' + db_jenis_registrasi + ` WHERE id=${jenis_registrasi_id}`);

        throw ({pesan: error_msg, 
                code: '401' ,
                jenis_registrasi: jenis_registrasi.rows[0].nama,
                details: wrong_format});
    }

    return {wrong_format, key, value}
}
