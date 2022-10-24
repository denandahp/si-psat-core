const core = require('../core.js')
const moment = require('moment-timezone');
const pool = require('../../libs/okkp_db.js');
const utils = require('./utils')
const utils_param = require('../../models/param/utils.js')

const schema_static = 'static';
const db_provinsi = schema_static + '.provinsi';

const schema_register = 'register';
const db_view_registrasi = schema_register + '.view_index_registrasi';
const db_view_index_uji_lab = schema_register + '.view_index_uji_lab';
const db_index_rapid_test = schema_register + '.view_index_rapid_test';



class DashboardController {
    async statistik_registrasi(param) {
        try {
            let provinsi='Semua Provinsi', created_at = '', terbit_sertif='';
            let jenis_sertif_dict = await utils.mapping_jenis_sertif_dict()
            let jenis_status_dict = await utils.mapping_status_dict()
            if(param.provinsi_id){
                provinsi = await pool.query(`SELECT * FROM ${db_provinsi} WHERE id=${param.provinsi_id}`);
                provinsi = provinsi.rows[0].nama
            }

            if(param.start_date && param.end_date){
                created_at = `created_at BETWEEN '${param.start_date}' AND '${param.end_date}' ` 
            }else{
                let start_date = moment().tz("Asia/jakarta").subtract(1, 'M').format('YYYY-MM-DD')
                let end_date = moment().tz("Asia/jakarta").format('YYYY-MM-DD')
                created_at = `created_at BETWEEN '${start_date}' AND '${end_date}'` 
            }

            if(param.start_terbit && param.end_terbit){
                terbit_sertif = `terbit_sertifikat BETWEEN '${param.start_terbit}' AND '${param.end_terbit}' AND `
            }
            let select = `jenis_registrasi_id, jenis_registrasi,
                          count(jenis_registrasi_id) AS total_registrasi,
                          count(case when status_id = ${jenis_status_dict['Masih Berlaku']} then 1 else null end) as total_masih_berlaku,
                          count(case when status_id = ${jenis_status_dict['Tidak Berlaku']} then 1 else null end) as total_tidak_berlaku,
                          count(case when jenis_sertifikat_id = ${jenis_sertif_dict['Prima 1']} then 1 else null end) as total_prima1,
                          count(case when jenis_sertifikat_id = ${jenis_sertif_dict['Prima 2']} then 1 else null end) as total_prima2,
                          count(case when jenis_sertifikat_id = ${jenis_sertif_dict['Prima 3']} then 1 else null end) as total_prima3,
                          count(case when jenis_sertifikat_id = ${jenis_sertif_dict['Sertifikat Jaminan Mutu Hidroponik']} then 1 else 0 end) as total_sertifikat_jaminan_mutu_hidroponik`
            let query = `SELECT ${select} FROM ${db_view_registrasi} WHERE ${core.check_value(param.provinsi_id, 'provinsi_id')} 
                         ${terbit_sertif} ${created_at} GROUP BY jenis_registrasi_id, jenis_registrasi ORDER BY jenis_registrasi_id ASC`
            let registrasi = await pool.query(query);
            return { status: '200', Provinsi: provinsi, data: registrasi.rows };
        } catch (ex) {
            return { status: '400', Error: "" + ex };
        };
    }

    async statistik_registrasi_by_year(year) {
        try {
            let jenis_registrasi_dict = await utils.mapping_jenis_registrasi_dict()

            let select = `
                EXTRACT(YEAR FROM created_at) as years,
                EXTRACT(MONTH FROM created_at) as months,
                COUNT(jenis_registrasi_id) AS count,
                count(case when jenis_registrasi_id = ${jenis_registrasi_dict['Registrasi PDUK']} then 1 else null end) as total_registrasi_pduk,
                count(case when jenis_registrasi_id = ${jenis_registrasi_dict['Izin Edar PSAT PD']} then 1 else null end) as total_izin_edar_pd,
                count(case when jenis_registrasi_id = ${jenis_registrasi_dict['Rumah Pengemasan (Packing House)']} then 1 else null end) as total_packing_house,
                count(case when jenis_registrasi_id = ${jenis_registrasi_dict['Sertifikat Jaminan Keamanan Pangan (Health Certificate)']} then 1 else null end) as total_hc,
                count(case when jenis_registrasi_id = ${jenis_registrasi_dict['SPPB-PSAT']} then 1 else null end) as total_sppb_psat,
                count(case when jenis_registrasi_id = ${jenis_registrasi_dict['Izin Edar PSAT PL']} then 1 else null end) as total_izin_edar_pl`
            let query = `SELECT ${select} FROM ${db_view_registrasi} WHERE EXTRACT(YEAR FROM created_at) = ${year} 
                         GROUP BY years, months ORDER BY months ASC`
            let registrasi = await pool.query(query);
            return { status: '200', year: year, data: registrasi.rows };
        } catch (ex) {
            return { status: '400', Error: "" + ex };
        };
    }

    async registrasi_by_provinsi(param) {
        try {
            let provinsi='Semua Provinsi', select, created_at = '', terbit_sertif='';
            if(param.provinsi_id){
                provinsi = await pool.query(`SELECT * FROM ${db_provinsi} WHERE id=${param.provinsi_id}`);
                provinsi = provinsi.rows[0].nama
            }
            if(param.unit_usaha){
                select = `provinsi_id, provinsi, count(DISTINCT unit_usaha) AS unit_usaha`
            }else if(param.jenis_registrasi_id){
                select = `provinsi_id, provinsi, count(jenis_registrasi_id) AS total_registrasi`
            }else{
                select = `provinsi_id, provinsi`
            }

            if(param.start_date && param.end_date){
                created_at = `created_at BETWEEN '${param.start_date}' AND '${param.end_date}' ` 
            }else{
                let start_date = moment().tz("Asia/jakarta").subtract(1, 'M').format('YYYY-MM-DD')
                let end_date = moment().tz("Asia/jakarta").format('YYYY-MM-DD')
                created_at = `created_at BETWEEN '${start_date}' AND '${end_date}'` 
            }

            if(param.start_terbit && param.end_terbit){
                terbit_sertif = `terbit_sertifikat BETWEEN '${param.start_terbit}' AND '${param.end_terbit}' AND `
            }

            let query = `SELECT ${select} FROM ${db_view_registrasi} WHERE ${core.check_value(param.provinsi_id, 'provinsi_id')} 
                         ${terbit_sertif} ${created_at} GROUP BY provinsi_id, provinsi ORDER BY provinsi_id ASC`
            console.log(query)
            let registrasi = await pool.query(query);
            return { status: '200', Provinsi: provinsi, data: registrasi.rows };
        } catch (ex) {
            return { status: '400', Error: "" + ex };
        };
    }

    async komoditas(param) {
        try {
            let provinsi='Semua Provinsi', created_at = '', terbit_sertif='';
            if(param.provinsi_id){
                provinsi = await pool.query(`SELECT * FROM ${db_provinsi} WHERE id=${param.provinsi_id}`);
                provinsi = provinsi.rows[0].nama
            }

            if(param.start_date && param.end_date){
                created_at = `created_at BETWEEN '${param.start_date}' AND '${param.end_date}' ` 
            }else{
                let start_date = moment().tz("Asia/jakarta").subtract(1, 'M').format('YYYY-MM-DD')
                let end_date = moment().tz("Asia/jakarta").format('YYYY-MM-DD')
                created_at = `created_at BETWEEN '${start_date}' AND '${end_date}'` 
            }

            if(param.start_terbit && param.end_terbit){
                terbit_sertif = `terbit_sertifikat BETWEEN '${param.start_terbit}' AND '${param.end_terbit}' AND `
            }

            let select = `komoditas_id, komoditas, count(jenis_registrasi_id) AS total_registrasi`
            let query = `SELECT ${select} FROM ${db_view_registrasi} WHERE ${core.check_value(param.provinsi_id, 'provinsi_id')} 
                         ${terbit_sertif} ${created_at} GROUP BY komoditas_id, komoditas ORDER BY total_registrasi DESC`
            let registrasi = await pool.query(query);
            return { status: '200', Provinsi: provinsi, data: registrasi.rows };
        } catch (ex) {
            return { status: '400', Error: "" + ex };
        };
    }

    async statistik_uji_lab(param) {
        try {
            let created_at = '', start_date, end_date;
            let status_uji_lab_dict = await utils.mapping_status_uji_lab_dict()

            if(param.start_date && param.end_date){
                start_date = param.start_date;
                end_date = param.end_date;
                created_at = `created_at BETWEEN '${start_date}' AND '${end_date}' ` 
            }else{
                start_date = moment().tz("Asia/jakarta").subtract(1, 'M').format('YYYY-MM-DD')
                end_date = moment().tz("Asia/jakarta").format('YYYY-MM-DD')
                created_at = `created_at BETWEEN '${start_date}' AND '${end_date}'` 
            }

            let select = `jenis_uji_lab_id, jenis_uji_lab,
                          count(jenis_uji_lab_id) AS total_uji_lab,
                          count(case when status_id = ${status_uji_lab_dict['MS']} then 1 else null end) as total_ms,
                          count(case when status_id = ${status_uji_lab_dict['TMS']} then 1 else null end) as total_tms`
            let query = `SELECT ${select} FROM ${db_view_index_uji_lab} WHERE ${created_at} 
                         GROUP BY jenis_uji_lab_id, jenis_uji_lab ORDER BY jenis_uji_lab_id ASC`
            let jenis_uji_lab = await pool.query(query);
            return {status: '200',
                    start_date: start_date,
                    end_date: end_date,
                    data: jenis_uji_lab.rows };
        } catch (ex) {
            return { status: '400', Error: "" + ex };
        };
    }

    async statistik_rapid_test(param) {
        try {
            let created_at = '',
                hasil_uji_negatif = 'Negatif',
                hasil_uji_positif = 'Positif',
                start_date, end_date;

            if(param.start_date && param.end_date){
                start_date = param.start_date;
                end_date = param.end_date;
                created_at = `created_at BETWEEN '${start_date}' AND '${end_date}' ` 
            }else{
                start_date = moment().tz("Asia/jakarta").subtract(1, 'M').format('YYYY-MM-DD')
                end_date = moment().tz("Asia/jakarta").format('YYYY-MM-DD')
                created_at = `created_at BETWEEN '${start_date}' AND '${end_date}'` 
            }

            let select = `jenis_rapid_test_id, jenis_rapid_test,
                          count(jenis_rapid_test_id) AS total_rapid_test,
                          count(case when hasil_uji = '${hasil_uji_negatif}' then 1 else null end) as total_negatif,
                          count(case when hasil_uji = '${hasil_uji_positif}' then 1 else null end) as total_positif`
            let query = `SELECT ${select} FROM ${db_index_rapid_test} WHERE ${created_at} 
                         GROUP BY jenis_rapid_test_id, jenis_rapid_test ORDER BY jenis_rapid_test_id ASC`
            let jenis_rapid_test = await pool.query(query);
            return {status: '200',
                    start_date: start_date,
                    end_date: end_date,
                    data: jenis_rapid_test.rows };
        } catch (ex) {
            return { status: '400', Error: "" + ex };
        };
    }
}
module.exports = new DashboardController();