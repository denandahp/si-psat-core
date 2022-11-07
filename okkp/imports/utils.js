const constant = require('../constant.js')
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
const db_status_uji_lab = schema_static + '.status_uji_lab';

const db_jenis_rapid_test= schema_static + '.jenis_rapid_test';
const db_rt_aflatoksin = schema_static + '.rt_aflatoksin';
const db_rt_logam_berat = schema_static + '.rt_logam_berat';
const db_rt_mikroba = schema_static + '.rt_mikroba';
const db_rt_pestisida = schema_static + '.rt_pestisida';

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
    let header_imports;
    if (body.jenis_uji){
        header_imports = await pool.query('SELECT * FROM ' + db_header_import + 
                                          ` WHERE jenis_uji=${body.jenis_uji} ORDER BY jenis_uji ASC`);
    }else if(body.registrasi_id){
        header_imports = await pool.query('SELECT * FROM ' + db_header_import + 
                                              ` WHERE jenis_registrasi_id=${body.registrasi_id} ORDER BY jenis_registrasi_id ASC`);
    }

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

exports.mapping_status_uji_lab_dict = async () => {
    let status_uji_lab_dict = {}
    let status_uji_lab = await pool.query(`select * from ${db_status_uji_lab}`)
    for(index in status_uji_lab.rows){
        status_uji_lab_dict[status_uji_lab.rows[index].nama] = {'id' : status_uji_lab.rows[index].id, 'Nama': status_uji_lab.rows[index].nama}
    }

    return status_uji_lab_dict
}

exports.mapping_rt_aflatoksin_dict = async () => {
    let rt_aflatoksin_dict = {}
    let rt_aflatoksin = await pool.query(`select * from ${db_rt_aflatoksin}`)
    for(index in rt_aflatoksin.rows){
        rt_aflatoksin_dict[rt_aflatoksin.rows[index].nama] = {'id' : rt_aflatoksin.rows[index].id, 'Nama': rt_aflatoksin.rows[index].nama}
    }

    return rt_aflatoksin_dict
}

exports.mapping_rt_logam_berat_dict = async () => {
    let rt_logam_berat_dict = {}
    let rt_logam_berat = await pool.query(`select * from ${db_rt_logam_berat}`)
    for(index in rt_logam_berat.rows){
        rt_logam_berat_dict[rt_logam_berat.rows[index].nama] = {'id' : rt_logam_berat.rows[index].id, 'Nama': rt_logam_berat.rows[index].nama}
    }

    return rt_logam_berat_dict
}

exports.mapping_rt_mikroba_dict = async () => {
    let rt_mikroba_dict = {}
    let rt_mikroba = await pool.query(`select * from ${db_rt_mikroba}`)
    for(index in rt_mikroba.rows){
        rt_mikroba_dict[rt_mikroba.rows[index].nama] = {'id' : rt_mikroba.rows[index].id, 'Nama': rt_mikroba.rows[index].nama}
    }

    return rt_mikroba_dict
}

exports.mapping_rt_pestisida_dict = async () => {
    let rt_pestisida_dict = {}
    let rt_pestisida = await pool.query(`select * from ${db_rt_pestisida}`)
    for(index in rt_pestisida.rows){
        rt_pestisida_dict[rt_pestisida.rows[index].nama] = {'id' : rt_pestisida.rows[index].id, 'Nama': rt_pestisida.rows[index].nama}
    }

    return rt_pestisida_dict
}

exports.mapping_jenis_rapid_test_dict = async () => {
    let jenis_rapid_test_dict = {}
    let jenis_rapid_test = await pool.query(`select * from ${db_jenis_rapid_test}`)
    for(index in jenis_rapid_test.rows){
        jenis_rapid_test_dict[jenis_rapid_test.rows[index].nama] = {'id' : jenis_rapid_test.rows[index].id, 'Nama': jenis_rapid_test.rows[index].nama}
    }

    return jenis_rapid_test_dict
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
            komoditas_id, err_msg, is_wrong_format = false;

        let komoditas = komoditas_dict[raw_data[index][5]]
        if (komoditas == undefined || komoditas == null){
            err_msg = 'Format Komoditas Salah';
            error_msg[err_msg] = true
            raw_data[index].push(err_msg, line);
            wrong_format.push(raw_data[index]);
            is_wrong_format = true
        }else {
            komoditas_id = komoditas.id
        }

        let no_registration = no_regis_dict[raw_data[index][10]]
        if (no_registration){
            err_msg = 'No Registrasi sudah terdaftar';
            error_msg[err_msg] = true
            raw_data[index].push(err_msg, line);
            wrong_format.push(raw_data[index]);
            is_wrong_format = true
        }else{
            no_registration = raw_data[index][10]
        }

        let terbit_sertifikat = raw_data[index][12];
        if(terbit_sertifikat){
            let is_valid = format_date.check_date_format(terbit_sertifikat)
            if(is_valid == false){
                err_msg = 'Format tanggal salah (DD/MM/YYYY)';
                error_msg[err_msg] = true
                raw_data[index].push(err_msg, line);
                wrong_format.push(raw_data[index]);
                is_wrong_format = true
            }else{
                terbit_sertifikat = format_date.date_format(terbit_sertifikat)
            }
        }

        line++;
        if(is_wrong_format){
            continue;
        }

        value.push(
            [jenis_registrasi_id, unit_usaha, kota, alamat_kantor, alamat_unit, komoditas_id, nama_psat, 
             nama_ilmiah, kemasan, merk, no_registration, label, terbit_sertifikat, provinsi_id, modified_by]
        )
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
            komoditas_id, err_msg, is_wrong_format = false;

        let komoditas = komoditas_dict[raw_data[index][5]]
        if (komoditas == undefined || komoditas == null){
            err_msg = 'Format Komoditas Salah';
            error_msg[err_msg] = true
            raw_data[index].push(err_msg, line);
            wrong_format.push(raw_data[index]);
            is_wrong_format = true
        }else {
            komoditas_id = komoditas.id
        }

        let no_registration = no_regis_dict[raw_data[index][10]]
        if (no_registration){
            err_msg = 'No Registrasi sudah terdaftar';
            error_msg[err_msg] = true
            raw_data[index].push(err_msg, line);
            wrong_format.push(raw_data[index]);
            is_wrong_format = true
        }else{
            no_registration = raw_data[index][10]
        }

        let terbit_sertifikat = raw_data[index][11];
        if(terbit_sertifikat){
            let is_valid = format_date.check_date_format(terbit_sertifikat)
            if(is_valid == false){
                err_msg = 'Format tanggal salah (DD/MM/YYYY)';
                error_msg[err_msg] = true
                raw_data[index].push(err_msg, line);
                wrong_format.push(raw_data[index]);
                is_wrong_format = true
            }else{
                terbit_sertifikat = format_date.date_format(terbit_sertifikat)
            }
        }

        line++;
        if(is_wrong_format){
            continue;
        }

        value.push(
            [jenis_registrasi_id, unit_usaha, kota, alamat_kantor, alamat_unit, komoditas_id, nama_psat, 
             nama_ilmiah, kemasan, merk, no_registration, terbit_sertifikat, provinsi_id, modified_by]
        )
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
            komoditas_id, err_msg, is_wrong_format = false;

        let komoditas = komoditas_dict[raw_data[index][7]]
        if (komoditas == undefined || komoditas == null){
            err_msg = 'Format Komoditas Salah';
            error_msg[err_msg] = true
            raw_data[index].push(err_msg, line);
            wrong_format.push(raw_data[index]);
            is_wrong_format = true
        }else {
            komoditas_id = komoditas.id
        }

        let no_registration = no_regis_dict[raw_data[index][10]]
        if (no_registration){
            err_msg = 'No Registrasi sudah terdaftar';
            error_msg[err_msg] = true
            raw_data[index].push(err_msg, line);
            wrong_format.push(raw_data[index]);
            is_wrong_format = true
        }else{
            no_registration = raw_data[index][10]
        }

        let terbit_sertifikat = raw_data[index][11];
        if(terbit_sertifikat){
            let is_valid = format_date.check_date_format(terbit_sertifikat)
            if(is_valid == false){
                err_msg = 'Format tanggal salah (DD/MM/YYYY)';
                error_msg[err_msg] = true
                raw_data[index].push(err_msg, line);
                wrong_format.push(raw_data[index]);
                is_wrong_format = true
            }else{
                terbit_sertifikat = format_date.date_format(terbit_sertifikat)
            }
        }

        line++;
        if(is_wrong_format){
            continue;
        }

        value.push(
            [jenis_registrasi_id, unit_usaha, kota, alamat_kantor, alamat_unit, ruang_lingkup, luas_lahan, komoditas_id, nama_psat, 
             nama_ilmiah, no_registration, terbit_sertifikat, provinsi_id, modified_by]
        )
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
            komoditas_id, jenis_hc_id, err_msg, is_wrong_format = false;

        let jenis_hc = jenis_hc_dict[raw_data[index][2]]
        if (jenis_hc == undefined || jenis_hc == null){
            err_msg = 'Format jenis sertifikat salah';
            error_msg[err_msg] = true
            raw_data[index].push(err_msg, line);
            wrong_format.push(raw_data[index]);
            is_wrong_format = true
        }else {
            jenis_hc_id = jenis_hc.id
        }

        let komoditas = komoditas_dict[raw_data[index][4]]
        if (komoditas == undefined || komoditas == null){
            err_msg = 'Format Komoditas Salah';
            error_msg[err_msg] = true
            raw_data[index].push(err_msg, line);
            wrong_format.push(raw_data[index]);
            is_wrong_format = true
        }else {
            komoditas_id = komoditas.id
        }

        let no_registration = no_regis_dict[raw_data[index][7]]
        if (no_registration){
            err_msg = 'No Registrasi sudah terdaftar';
            error_msg[err_msg] = true
            raw_data[index].push(err_msg, line);
            wrong_format.push(raw_data[index]);
            is_wrong_format = true
        }else{
            no_registration = raw_data[index][7]
        }

        let terbit_sertifikat = raw_data[index][8];
        if(terbit_sertifikat){
            let is_valid = format_date.check_date_format(terbit_sertifikat)
            if(is_valid == false){
                err_msg = 'Format tanggal salah (DD/MM/YYYY)';
                error_msg[err_msg] = true
                raw_data[index].push(err_msg, line);
                wrong_format.push(raw_data[index]);
                is_wrong_format = true
            }else{
                terbit_sertifikat = format_date.date_format(terbit_sertifikat)
            }
        }

        line++;
        if(is_wrong_format){
            continue;
        }

        value.push(
            [jenis_registrasi_id, unit_usaha, jenis_hc_id, alamat_kantor, komoditas_id, identitas_lot, 
             negara_tujuan, no_registration, terbit_sertifikat, provinsi_id, modified_by]
        )
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
            komoditas_id, err_msg, is_wrong_format = false;

        let komoditas = komoditas_dict[raw_data[index][5]]
        if (komoditas == undefined || komoditas == null){
            err_msg = 'Format Komoditas Salah';
            error_msg[err_msg] = true
            raw_data[index].push(err_msg, line);
            wrong_format.push(raw_data[index]);
            is_wrong_format = true
        }else {
            komoditas_id = komoditas.id
        }

        let no_registration = no_regis_dict[raw_data[index][10]]
        if (no_registration){
            err_msg = 'No Registrasi sudah terdaftar';
            error_msg[err_msg] = true
            raw_data[index].push(err_msg, line);
            wrong_format.push(raw_data[index]);
            is_wrong_format = true
        }else{
            no_registration = raw_data[index][10]
        }

        let terbit_sertifikat = raw_data[index][11];
        if(terbit_sertifikat){
            let is_valid = format_date.check_date_format(terbit_sertifikat)
            if(is_valid == false){
                err_msg = 'Format tanggal salah (DD/MM/YYYY)';
                error_msg[err_msg] = true
                raw_data[index].push(err_msg, line);
                wrong_format.push(raw_data[index]);
                is_wrong_format = true
            }else{
                terbit_sertifikat = format_date.date_format(terbit_sertifikat)
            }
        }

        line++;
        if(is_wrong_format){
            continue;
        }

        value.push(
            [jenis_registrasi_id, unit_usaha, alamat_kantor, alamat_unit, ruang_lingkup, komoditas_id, nama_psat, 
             nama_ilmiah, kemasan, merk, no_registration, terbit_sertifikat, provinsi_id, modified_by]
        )
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
            komoditas_id, jenis_sertifikat_id, err_msg, 
            is_wrong_format = false;

        let komoditas = komoditas_dict[raw_data[index][5]]
        if (komoditas == undefined || komoditas == null){
            err_msg = 'Format Komoditas Salah';
            error_msg[err_msg] = true
            raw_data[index].push(err_msg, line);
            wrong_format.push(raw_data[index]);
            is_wrong_format = true
        }else {
            komoditas_id = komoditas.id
        }

        let jenis_sertif = jenis_sertif_dict[raw_data[index][9]]
        if (jenis_sertif == undefined || jenis_sertif == null){
            err_msg = 'Format Prima 1/2/3 Salah';
            error_msg[err_msg] = true
            raw_data[index].push(err_msg, line);
            wrong_format.push(raw_data[index]);
            is_wrong_format = true
        }else {
            jenis_sertifikat_id = jenis_sertif.id
        }

        let no_registration = no_regis_dict[raw_data[index][10]]
        if (no_registration){
            err_msg = 'No Registrasi sudah terdaftar';
            error_msg[err_msg] = true
            raw_data[index].push(err_msg, line);
            wrong_format.push(raw_data[index]);
            is_wrong_format = true
        }else{
            no_registration = raw_data[index][10]
        }

        let terbit_sertifikat = raw_data[index][11];
        if(terbit_sertifikat){
            let is_valid = format_date.check_date_format(terbit_sertifikat)
            if(is_valid == false){
                err_msg = 'Format tanggal salah (DD/MM/YYYY)';
                error_msg[err_msg] = true
                raw_data[index].push(err_msg, line);
                wrong_format.push(raw_data[index]);
                is_wrong_format = true
            }else{
                terbit_sertifikat = format_date.date_format(terbit_sertifikat)
            }
        }

        line++;
        if(is_wrong_format){
            continue;
        }

        value.push(
            [jenis_registrasi_id, unit_usaha, kota, alamat_kantor, alamat_unit, komoditas_id, nama_psat, 
             nama_ilmiah, merk, jenis_sertifikat_id, no_registration, terbit_sertifikat, provinsi_id, modified_by]
        )
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

exports.uji_lab = async (raw_data, body, user) => {
    let jenis_uji_lab_id = body.jenis_uji_lab,
        jenis_uji = body.jenis_uji,
        modified_by = user.email,
        created_by = user.email,
        user_id = user.id,
        provinsi_id = body.provinsi_id,
        error_msg = {};

    let komoditas_dict = await this.mapping_komoditas_dict()
    let status_uji_lab = await this.mapping_status_uji_lab_dict()

    // Get key dari constant
    let field_registrasi = await constant.field_db_uji(jenis_uji)
    let key = field_registrasi.toString()
    let value = [], wrong_format = [], line =1;

    // Mapping data
    for(index in raw_data){
        let no = raw_data[index][0],
            lembaga = raw_data[index][1],
            lokasi_sampel = raw_data[index][3],
            komoditas_tambahan = raw_data[index][5],
            hasil_uji = raw_data[index][6],
            parameter = raw_data[index][7],
            standar = raw_data[index][8],
            referensi_bmr = raw_data[index][9],
            metode_uji = raw_data[index][10],
            err_msg, 
            is_wrong_format = false;

        let tanggal = raw_data[index][2];
        if(tanggal){
            let is_valid = format_date.check_date_format(tanggal)
            if(is_valid == false){
                err_msg = 'Format tanggal salah (DD/MM/YYYY)';
                error_msg[err_msg] = true
                raw_data[index].push(err_msg, line);
                wrong_format.push(raw_data[index]);
                is_wrong_format = true
            }else{
                tanggal = format_date.date_format(tanggal)
            }
        }

        let komoditas = komoditas_dict[raw_data[index][4]]
        if (komoditas == undefined || komoditas == null){
            err_msg = 'Format Komoditas Salah';
            error_msg[err_msg] = true
            raw_data[index].push(err_msg, line);
            wrong_format.push(raw_data[index]);
            is_wrong_format = true
        }else {
            komoditas_id = komoditas.id
        }

        let status_id = status_uji_lab[raw_data[index][11]].id
        if (status_id == undefined || status_id == null){
            err_msg = 'Status Uji Lab Salah';
            error_msg[err_msg] = true
            raw_data[index].push(err_msg, line);
            wrong_format.push(raw_data[index]);
            is_wrong_format = true
        }

        line++;
        if(is_wrong_format){
            continue;
        }

        value.push(
            [jenis_uji_lab_id, user_id, lembaga, tanggal, lokasi_sampel, komoditas_id, komoditas_tambahan, parameter, 
             hasil_uji, standar, status_id, referensi_bmr, metode_uji, created_by, modified_by, provinsi_id]
        )
    }

    return {wrong_format, key, value}
}

exports.rapid_test = async (raw_data, body, user) => {
    let jenis_rapid_test_id = body.jenis_rapid_test,
        jenis_uji = body.jenis_uji,
        modified_by = user.email,
        created_by = user.email,
        user_id = user.id,
        provinsi_id = body.provinsi_id,
        error_msg = {},
        parameter_dict;

    let komoditas_dict = await this.mapping_komoditas_dict()
    let jenis_rapid_test_dict = await this.mapping_jenis_rapid_test_dict()

    if(jenis_rapid_test_id == jenis_rapid_test_dict['Rapid Test Aflatoksin'].id){
        parameter_dict = await this.mapping_rt_aflatoksin_dict()
    }else if(jenis_rapid_test_id == jenis_rapid_test_dict['Rapid Test Logam Berat'].id){
        parameter_dict = await this.mapping_rt_logam_berat_dict()
    }else if(jenis_rapid_test_id == jenis_rapid_test_dict['Rapid Test Mikroba'].id){
        parameter_dict = await this.mapping_rt_mikroba_dict()
    }else if(jenis_rapid_test_id == jenis_rapid_test_dict['Rapid Test Pestisida'].id){
        parameter_dict = await this.mapping_rt_pestisida_dict()
    }

    // Get key dari constant
    let field_registrasi = await constant.field_db_uji(jenis_uji)
    let key = field_registrasi.toString()
    let value = [], wrong_format = [], line =1;

    // Mapping data
    for(index in raw_data){
        let no = raw_data[index][0],
            lembaga = raw_data[index][1],
            lokasi_sampel = raw_data[index][3],
            komoditas_tambahan = raw_data[index][5],
            hasil_uji = raw_data[index][7],
            note = raw_data[index][8],
            err_msg, is_wrong_format = false, 
            logam_berat_id, mikroba_id, aflatoksin_id, pestisida_id;

        let tanggal = raw_data[index][2];
        if(tanggal){
            let is_valid = format_date.check_date_format(tanggal)
            if(is_valid == false){
                err_msg = 'Format tanggal salah (DD/MM/YYYY)';
                error_msg[err_msg] = true
                raw_data[index].push(err_msg, line);
                wrong_format.push(raw_data[index]);
                is_wrong_format = true
            }else{
                tanggal = format_date.date_format(tanggal)
            }
        }

        let komoditas = komoditas_dict[raw_data[index][4]]
        if (komoditas == undefined || komoditas == null){
            err_msg = 'Format Komoditas Salah';
            error_msg[err_msg] = true
            raw_data[index].push(err_msg, line);
            wrong_format.push(raw_data[index]);
            is_wrong_format = true
        }else {
            komoditas_id = komoditas.id
        }

        let parameter = parameter_dict[raw_data[index][6]]
        if (parameter == undefined || parameter == null){
            err_msg = 'Format Parameter Salah';
            error_msg[err_msg] = true
            raw_data[index].push(err_msg, line);
            wrong_format.push(raw_data[index]);
            is_wrong_format = true
        }else {
            if(jenis_rapid_test_id == jenis_rapid_test_dict['Rapid Test Aflatoksin'].id){
                aflatoksin_id = parameter.id
            }else if(jenis_rapid_test_id == jenis_rapid_test_dict['Rapid Test Logam Berat'].id){
                logam_berat_id = parameter.id
            }else if(jenis_rapid_test_id == jenis_rapid_test_dict['Rapid Test Mikroba'].id){
                mikroba_id = parameter.id
            }else if(jenis_rapid_test_id == jenis_rapid_test_dict['Rapid Test Pestisida'].id){
                pestisida_id = parameter.id
            }
        }

        line++;
        if(is_wrong_format){
            continue;
        }

        value.push(
            [jenis_rapid_test_id, user_id, lembaga, tanggal, lokasi_sampel, komoditas_id, komoditas_tambahan, 
             logam_berat_id, mikroba_id, aflatoksin_id, pestisida_id, hasil_uji, note, created_by, modified_by, provinsi_id]
        )
    }

    return {wrong_format, key, value}
}