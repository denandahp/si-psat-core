const core = require('../core.js')
const pool = require('../../libs/okkp_db');

const schema_regis = 'register';
const db_view_index_registarasi = schema_regis + '.view_index_registrasi';
const db_view_index_uji_lab = schema_regis + '.view_index_uji_lab';
const db_view_index_rapid_test = schema_regis + '.view_index_rapid_test';


class ExportsModel {
    async export_registration(data) {
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
                return { status: '400', jenis_registrasi: ex.jenis_registrasi, Error: ex.pesan, not_created: ex.details };
            }
            console.log('Error ' + ex.message )
            return { status: '400', Error: "" + ex.message };
        };
    }

    async export_uji_lab(data) {
        try {
            let jenis_uji_lab_id = data.jenis_uji_lab_id,
                keys = data.headers,
                start_date = data.start_date,
                end_date = data.end_date;

            keys.unshift('jenis_uji_lab')
            keys.push('created_at')
            let query = `SELECT ${keys.toString()} FROM ${db_view_index_uji_lab} WHERE jenis_uji_lab_id=${jenis_uji_lab_id} 
                         AND created_at BETWEEN '${start_date}' AND '${end_date}' ORDER BY created_at DESC`
            let uji_lab = await pool.query(query);
            return {uji_lab : uji_lab.rows, keys: keys}
        } catch (ex) {
            if (ex.code == '401') {
                return { status: '400', uji_lab: ex.uji_lab, Error: ex.pesan, not_created: ex.details };
            }
            console.log('Error ' + ex.message )
            return { status: '400', Error: "" + ex.message };
        };
    }

    async export_rapid_test(data) {
        try {
            let jenis_rapid_test_id = data.jenis_rapid_test_id,
                keys = data.headers,
                start_date = data.start_date,
                end_date = data.end_date;

            keys.unshift('jenis_rapid_test')
            keys.push('created_at')
            let query = `SELECT ${keys.toString()} FROM ${db_view_index_rapid_test} WHERE jenis_rapid_test_id=${jenis_rapid_test_id} 
                         AND created_at BETWEEN '${start_date}' AND '${end_date}' ORDER BY created_at DESC`
            let rapid_test = await pool.query(query);
            return {rapid_test : rapid_test.rows, keys: keys}
        } catch (ex) {
            if (ex.code == '401') {
                return { status: '400', rapid_test: ex.rapid_test, Error: ex.pesan, not_created: ex.details };
            }
            console.log('Error ' + ex.message )
            return { status: '400', Error: "" + ex.message };
        };
    }
}
module.exports = new ExportsModel();