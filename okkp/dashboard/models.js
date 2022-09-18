const core = require('../core.js')
const pool = require('../../libs/okkp_db.js');
const utils = require('./utils')

const schema_static = 'static';
const db_provinsi = schema_static + '.provinsi';

const schema_register = 'register';
const db_view_registrasi = schema_register + '.view_index_registrasi';


class DashboardController {
    async statistik_registrasi(param) {
        try {
            let provinsi='Semua Provinsi', where='';
            let jenis_sertif_dict = await utils.mapping_jenis_sertif_dict()
            let jenis_status_dict = await utils.mapping_status_dict()
            if(param.provinsi_id){
                provinsi = await pool.query(`SELECT * FROM ${db_provinsi} WHERE id=${param.provinsi_id}`);
                provinsi = provinsi.rows[0].nama
                where = 'WHERE'
            }
            let select = `jenis_registrasi_id,
                          count(jenis_registrasi_id) AS total_registrasi,
                          count(case when status_id = ${jenis_status_dict['Masih Berlaku']} then 1 else null end) as total_masih_berlaku,
                          count(case when status_id = ${jenis_status_dict['Tidak Berlaku']} then 1 else null end) as total_tidak_berlaku,
                          count(case when jenis_sertifikat_id = ${jenis_sertif_dict['Prima 1']} then 1 else null end) as total_prima1,
                          count(case when jenis_sertifikat_id = ${jenis_sertif_dict['Prima 2']} then 1 else null end) as total_prima2,
                          count(case when jenis_sertifikat_id = ${jenis_sertif_dict['Prima 3']} then 1 else null end) as total_prima3,
                          count(case when jenis_sertifikat_id = ${jenis_sertif_dict['Sertifikat Jaminan Mutu Hidroponik']} then 1 else 0 end) as total_sertifikat_jaminan_mutu_hidroponik`
            let query = `SELECT ${select} FROM ${db_view_registrasi} ${where} ${core.check_value(param.provinsi_id, 'provinsi_id', true)} 
                         GROUP BY jenis_registrasi_id ORDER BY jenis_registrasi_id ASC`
            let registrasi = await pool.query(query);
            return { status: '200', Provinsi: provinsi, data: registrasi.rows };
        } catch (ex) {
            return { status: '400', Error: "" + ex };
        };
    }

    async registrasi_by_provinsi(param) {
        try {
            let provinsi='Semua Provinsi', where='', select;
            if(param.provinsi_id){
                provinsi = await pool.query(`SELECT * FROM ${db_provinsi} WHERE id=${param.provinsi_id}`);
                provinsi = provinsi.rows[0].nama
                where = 'WHERE'
            }
            if(param.unit_usaha){
                select = `provinsi_id, provinsi, count(DISTINCT unit_usaha) AS unit_usaha`
            }else if(param.jenis_registrasi_id){
                select = `provinsi_id, provinsi, count(jenis_registrasi_id) AS total_registrasi`
            }else{
                select = `provinsi_id, provinsi`
            }
            let query = `SELECT ${select} FROM ${db_view_registrasi} ${where} ${core.check_value(param.provinsi_id, 'provinsi_id', true)} 
                         GROUP BY provinsi_id, provinsi ORDER BY provinsi_id ASC`
            let registrasi = await pool.query(query);
            return { status: '200', Provinsi: provinsi, data: registrasi.rows };
        } catch (ex) {
            return { status: '400', Error: "" + ex };
        };
    }

    async komoditas(param) {
        try {
            let provinsi='Semua Provinsi', where='';
            if(param.provinsi_id){
                provinsi = await pool.query(`SELECT * FROM ${db_provinsi} WHERE id=${param.provinsi_id}`);
                provinsi = provinsi.rows[0].nama
                where = 'WHERE'
            }

            let select = `komoditas_id, komoditas, count(jenis_registrasi_id) AS total_registrasi`
            let query = `SELECT ${select} FROM ${db_view_registrasi} ${where} ${core.check_value(param.provinsi_id, 'provinsi_id', true)} 
                         GROUP BY komoditas_id, komoditas ORDER BY total_registrasi DESC`
            let registrasi = await pool.query(query);
            return { status: '200', Provinsi: provinsi, data: registrasi.rows };
        } catch (ex) {
            return { status: '400', Error: "" + ex };
        };
    }
}
module.exports = new DashboardController();