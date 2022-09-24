const core = require('../core.js')
const pool = require('../../libs/okkp_db');

const schema_regis = 'register';
const db_view_index_registarasi = schema_regis + '.view_index_registrasi';


class ExportsModel {
    async model_exports(data) {
        try {
            let jenis_registrasi_id = data.jenis_registrasi_id,
                provinsi_id = data.provinsi_id,
                keys = data.headers,
                start_date = data.start_date,
                end_date = data.end_date;

            if(provinsi_id == 'all'){
                provinsi_id = undefined
            }

            keys.unshift('jenis_registrasi')
            keys.push('provinsi,created_at')
            let query = `SELECT ${keys.toString()} FROM ${db_view_index_registarasi} WHERE 
                        ${core.check_value(provinsi_id,'provinsi_id')} jenis_registrasi_id=${jenis_registrasi_id} 
                         AND created_at BETWEEN '${start_date}' AND '${end_date}' ORDER BY created_at DESC`
            let jenis_registrasi = await pool.query(query);
            return {jenis_registrasi : jenis_registrasi.rows, keys: keys}
        } catch (ex) {
            if (ex.code == '401') {
                return { status: '400', jenis_registrasi: ex.jenis_registrasi, Error: ex.pesan, not_upload: ex.details };
            }
            console.log('Error ' + ex.message )
            return { status: '400', Error: "" + ex.message };
        };
    }
}
module.exports = new ExportsModel();