var format = require('pg-format');
const pool = require('../../libs/okkp_db');
const utils = require('./utils.js')

const schema_static = 'static'
const schema_regis = 'register';

const db_registrations = schema_regis + '.registrasi';
const db_uji_lab = schema_regis + '.uji_lab';
const db_rapid_test = schema_regis + '.rapid_test';

const db_jenis_registrasi = schema_static + '.jenis_registrasi';
const db_jenis_uji_lab = schema_static + '.jenis_uji_lab ';
const db_jenis_rapid_test = schema_static + '.jenis_rapid_test';



class ImportModel {
    async import_excels_registration(raw_data, body, user) {
        try {
            let jenis_registrasi_id = body.registrasi_id,
                wrong_format, key, value;

            if(jenis_registrasi_id == 1){
                ({wrong_format, key, value} = await utils.mapping_pd_uk(raw_data, body, user))
            }else if(jenis_registrasi_id == 2){
                ({wrong_format, key, value} = await utils.izin_edar_psat_pd(raw_data, body, user))
            }else if(jenis_registrasi_id == 3){
                ({wrong_format, key, value} = await utils.packing_house(raw_data, body, user))
            }else if(jenis_registrasi_id == 4){
                ({wrong_format, key, value} = await utils.health_certificate(raw_data, body, user))
            }else if(jenis_registrasi_id == 5){
                ({wrong_format, key, value} = await utils.sppb_psat_provinsi(raw_data, body, user))
            }else if(jenis_registrasi_id == 6){
                ({wrong_format, key, value} = await utils.sertifikasi_prima(raw_data, body, user))
            }
            let jenis_registrasi = await pool.query('SELECT * FROM ' + db_jenis_registrasi + ` WHERE id=${jenis_registrasi_id}`);
            await pool.query(format('INSERT INTO ' + db_registrations + ` (${key}) VALUES %L`, value));

            return {status: '200', 
                    jenis_registrasi: jenis_registrasi.rows[0].nama,
                    keterangan: 'Import Success',
                    not_created: wrong_format};
        } catch (ex) {
            if (ex.code == '401') {
                return { status: '400', jenis_registrasi: ex.jenis_registrasi, Error: ex.pesan, not_upload: ex.details };
            }
            console.log('Error ' + ex.message )
            return { status: '400', Error: "" + ex.message };
        };
    }

    async import_excels_uji_lab(raw_data, body, user) {
        try {
            let jenis_uji= body.jenis_uji,
                wrong_format, key, value,
                jenis_uji_lab;
            
                await pool.query('BEGIN');
            if(jenis_uji == 1){
                let id_jenis_uji_lab = body.jenis_uji_lab
                jenis_uji_lab = await pool.query('SELECT * FROM ' + db_jenis_uji_lab + ` WHERE id=${id_jenis_uji_lab}`);
                ({wrong_format, key, value} = await utils.uji_lab(raw_data, body, user))
                await pool.query(format('INSERT INTO ' + db_uji_lab + ` (${key}) VALUES %L`, value));
            }else if(jenis_uji == 2){
                let id_jenis_rapid_test = body.jenis_rapid_test
                jenis_uji_lab = await pool.query('SELECT * FROM ' + db_jenis_rapid_test + ` WHERE id=${id_jenis_rapid_test}`);
                ({wrong_format, key, value} = await utils.rapid_test(raw_data, body, user))
                // await pool.query(format('INSERT INTO ' + db_rapid_test + ` (${key}) VALUES %L`, value));
            }
            await pool.query('COMMIT');

            return {status: '200', 
                    jenis_uji: jenis_uji_lab.rows[0].nama,
                    keterangan: 'Import Success',
                    not_created: wrong_format};
        } catch (ex) {
            await pool.query('ROLLBACK');
            if (ex.code == '401') {
                return { status: '400', jenis_registrasi: ex.jenis_registrasi, Error: ex.pesan, not_upload: ex.details };
            }
            console.log('Error ' + ex.message )
            return { status: '400', Error: "" + ex.message };
        };
    }
}
module.exports = new ImportModel();