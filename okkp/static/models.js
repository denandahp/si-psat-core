const mysql = require('../../libs/mysql.js');
const pool = require('../../libs/okkp_db.js');
var format = require('pg-format');

let schema = 'static';
let db_komoditas = schema + '.komoditas';
let db_jenis_registrasi = schema + '.jenis_registrasi';
let db_jenis_sertifikat = schema + '.jenis_sertifikat';
let db_jenis_hc = schema + '.jenis_hc';
let db_provinsi = schema + '.provinsi';
let db_status = schema + '.status';

class StaticController {
    async index_komoditas() {
        try {
            let komoditas = await pool.query(format('SELECT id, nama FROM ' + db_komoditas));
            return { status: '200', data: komoditas.rows};
        } catch (ex) {
            console.log('data', 'error ' + ex)
        };
    }

    async index_jenis_registrasi() {
        try {
            let jenis_registrasi = await pool.query(format('SELECT id, nama FROM ' + db_jenis_registrasi));
            return { status: '200', data: jenis_registrasi.rows};
        } catch (ex) {
            console.log('data', 'error ' + ex)
        };
    }

    async index_jenis_sertifikat() {
        try {
            let jenis_sertifikat = await pool.query(format('SELECT id, nama FROM ' + db_jenis_sertifikat));
            return { status: '200', data: jenis_sertifikat.rows};
        } catch (ex) {
            console.log('data', 'error ' + ex)
        };
    }

    async index_status() {
        try {
            let status = await pool.query(format('SELECT id, nama FROM ' + db_status));
            return { status: '200', data: status.rows};
        } catch (ex) {
            console.log('data', 'error ' + ex)
        };
    }

    async index_provinsi() {
        try {
            let status = await pool.query(format('SELECT id, nama FROM ' + db_provinsi));
            return { status: '200', data: status.rows};
        } catch (ex) {
            console.log('data', 'error ' + ex)
        };
    }

    async sync_data() {
        try {
            let nama = []
            let data_mysql = await mysql.query('SELECT * FROM provinsi ORDER BY n_prov ASC')
            for (let index in data_mysql){
                nama.push([data_mysql[index].n_prov, data_mysql[index].lat, data_mysql[index].long])
            }
            console.log(nama)
            let data_pg = await pool.query(format(`INSERT INTO `+ db_provinsi +` (nama, latitude, longitude) VALUES %L RETURNING *`, nama));

            return { status: '200', data: data_pg.rows};
        } catch (ex) {
            console.log('error ' + ex)
        };
    }
}
module.exports = new StaticController();