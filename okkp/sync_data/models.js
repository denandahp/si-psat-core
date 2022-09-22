const param_utils = require('../../models/param/utils.js');
const mysql = require('../../libs/mysql.js');
const pool_okkp = require('../../libs/okkp_db.js');
const pool_psat = require('../../libs/db.js');
var format = require('pg-format');

let schema = 'static';

let schema_user_psat = 'pengguna';
let db_info_sekretariat = schema_user_psat + '.info_sekretariat';
let db_pengguna = schema_user_psat + '.pengguna';



class SyncDataController {
    async sync_data_static() {
        try {
            let nama = []
            let data_mysql = await mysql.query('SELECT * FROM komoditas ORDER BY komoditas ASC')
            for (let index in data_mysql){
                nama.push([data_mysql[index].komoditas])
            }
            // let data_pg = await pool.query(format(`INSERT INTO `+ db_komoditas +` (nama) VALUES %L RETURNING *`, nama));

            return { status: '200', data: data_pg.rows};
        } catch (ex) {
            console.log('error ' + ex)
        };
    }

    async sync_data_user() {
        try {
            let data_mysql = await mysql.query('SELECT * FROM cms_users WHERE id > 23 ORDER BY id ASC')
            let provinsi = await mysql.query('SELECT * FROM provinsi')
            let provinsi_dict = {}
            for (let index in provinsi){
                provinsi_dict[provinsi[index].id] = provinsi[index].n_prov
            }

            for (let index in data_mysql){
                let provinsi_name = provinsi_dict[data_mysql[index].id_provinsi]
                let info_sekretariat_dict ={
                    nama : data_mysql[index].name,
                    email : data_mysql[index].email,
                    duduk_lembaga : data_mysql[index].duduk_lembaga,
                    alamat : data_mysql[index].alamat,
                    telp_fax : data_mysql[index].telpfax,
                    kontak : data_mysql[index].kontak,
                    sk_gub : data_mysql[index].sk_gub,
                    lembaga : data_mysql[index].s_lembaga,
                    ruang_lingkup : data_mysql[index].r_lingkup,
                    ketua : data_mysql[index].ketua,
                    m_admin : data_mysql[index].m_admin,
                    m_mutu : data_mysql[index].m_mutu,
                    m_teknis : data_mysql[index].m_teknis,
                    m_representatif : data_mysql[index].m_representatif,
                    provinsi : provinsi_name,
                    no_verifikasi : data_mysql[index].no_verifikasi,
                    tanggal_awal : data_mysql[index].tgl_awal,
                    tanggal_akhir : data_mysql[index].tgl_akhir,
                    created : data_mysql[index].created_at,
                    update : data_mysql[index].updated_at,
                    status : true
                } 
                let key_info_sekretariat = Object.keys(info_sekretariat_dict).toString()
                let value_info_sekretariat = Object.values(info_sekretariat_dict)
                // let info_sekretariat = await pool_psat.query(format(`INSERT INTO `+ db_info_sekretariat + ` (${key_info_sekretariat}) VALUES (%L) RETURNING *`, value_info_sekretariat));

                let role_user;
                if(data_mysql[index].id_cms_privileges == 1){
                    role_user = 'SUPERADMIN'
                }else if(data_mysql[index].id_cms_privileges == 2){
                    role_user = 'OKKP_ADMIN_DAERAH'
                }else if(data_mysql[index].id_cms_privileges == 3){
                    role_user = 'OKKP_ADMIN_PUSAT'
                }else if(data_mysql[index].id_cms_privileges == 4){
                    role_user = 'OKKP_ADMIN_UJILAB'
                }

                let pengguna_dict ={
                    username : data_mysql[index].email,
                    password : 12345,
                    info_sekretariat : info_sekretariat.rows[0].id,
                    role : role_user,
                    is_deleted : false
                }

                let key_pengguna = Object.keys(pengguna_dict).toString()
                let value_pengguna = Object.values(pengguna_dict)
                // let pengguna = await pool_psat.query(format(`INSERT INTO `+ db_pengguna + ` (${key_pengguna}) VALUES (%L) RETURNING *`, value_pengguna));
                console.log(`ID user mysql: ${data_mysql[index].id} Success,`, `info secretariat : ${info_sekretariat.rows[0].id} Success,`,  `info pengguna : ${pengguna.rows[0].id} Success`)
            }

            return { status: '200', message: 'success'};
        } catch (ex) {
            console.log('error ' + ex)
        };
    }
}
module.exports = new SyncDataController();