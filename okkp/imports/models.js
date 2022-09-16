var format = require('pg-format');
const pool = require('../../libs/okkp_db');
const utils = require('./utils.js')

const schema_static = 'static'
const schema_regis = 'register';
const db_registrations = schema_regis + '.registrasi';
const db_jenis_registrasi = schema_static + '.jenis_registrasi';



class ImportModel {
    async model_imports(raw_data, body, user) {
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
            }
            let jenis_registrasi = await pool.query('SELECT * FROM ' + db_jenis_registrasi + ` WHERE id=${jenis_registrasi_id}`);
            await pool.query(format('INSERT INTO ' + db_registrations + ` (${key}) VALUES %L`, value));

            return { status: '200', jenis_registrasi: jenis_registrasi.rows[0].nama , keterangan: 'Import Success', not_upload: wrong_format};
        } catch (ex) {
            if (ex.code == '401') {
                return { status: '400', jenis_registrasi: ex.jenis_registrasi, Error: ex.pesan, not_upload: ex.details };
            }
            console.log('Error ' + ex.message )
            return { status: '400', Error: "" + ex.message };
        };
    }
}
module.exports = new ImportModel();