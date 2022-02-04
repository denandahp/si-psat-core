let database;
const dotenv = require('dotenv');
dotenv.config();

const debug = require('debug')('app:model:oss');
const oss_param = require('./param/oss.js');
const pool = require('../libs/db');
const format_date = require('./param/utils.js');


const schema_public = '"public"';
const schema_pengguna = '"pengguna"';
const db_oss = schema_public + '.' + '"oss"';
const db_info_kepemilikan = schema_pengguna + '.' + '"info_kepemilikan"';
const db_pengguna = schema_pengguna + '.' + '"pengguna"';


const crypto = require('crypto')
const md5 = require('md5');

var date = format_date.date_now();

class OSSModel {


    async generate_user_key(type) {

        function sha1(val) {
            return crypto.createHash("sha1").update(val, "binary").digest("hex");
        }

        function converte_date() {
            function pad2(n) {
                return (n < 10 ? '0' : '') + n;
            }
            var date_token = new Date();
            var month = pad2(date_token.getMonth() + 1); //months (0-11)
            var day = pad2(date_token.getDate()); //day (1-31)
            var year = date_token.getFullYear();

            var formattedDate = year + "-" + month + "-" + day;
            return formattedDate
        }

        let data = {
            username: process.env.OSS_USERNAME,
            password: md5(process.env.OSS_PASSWORD),
            type: type,
            formattedDate: converte_date()
        }

        let user_key = sha1(data.username + data.password + data.type + data.formattedDate)
        return {
            data: data,
            user_key
        };
    }

    async receive_nib(data, token) {
        try {
            let response;
            let limit = format_date.limit_time(60)
            let value = [token, data.dataNIB.id_izin, data.dataNIB.kd_izin, data.dataNIB.no_id_user_proses, data.dataNIB, limit];
            response = await pool.query('INSERT INTO ' + db_oss + '(token, id_izin, kode_izin, no_identitas, receive_nib, created)' +
                'VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_izin, kode_izin, no_identitas', value);
            debug('get %o', response);
            return { status: 200, keterangan: "success" };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }
    async validate_token(data) {
        try {

            const url = 'http://izinusaha.pertanian.go.id/midoss/api/services-stg/validateToken';
            const x_sm_key = '35d3d08c3d7b7f445ceb8e726a87b26c'
            let oss = await oss_param.user_info(url, auth, x_sm_key, data.user_key, data.token);
            return oss;
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async pelaku_usaha(data) {
        try {
            let response = {};
            let query_data, user_info, process_data, process, pengguna;
            const url = 'http://izinusaha.pertanian.go.id/midoss/api/services-stg/userInfoToken';
            const x_sm_key = '35d3d08c3d7b7f445ceb8e726a87b26c'
            let oss = await oss_param.user_info(url, auth, x_sm_key, data.user_key, data.token);

            if (oss.OSS_result.status == 401) {
                return {
                    status: 400,
                    oss
                }
            }
            let check_last_izin = await pool.query(
                'Select * FROM ' + db_oss + 'WHERE kode_izin = $1 AND id_izin = $2 AND created >= $3', [data.kd_izin, data.id_izin, date]);
            if (check_last_izin.rowCount <= 0) {
                throw new Error('Process Expired');
            } else {
                process_data = [data.kd_izin, data.id_izin, data.token, data.user, 'LOGIN', oss.id_profile, date];
                process = await pool.query(
                    'UPDATE ' + db_oss + 'SET (token, user_key, status, id_user, last_login) ' +
                    '=($3, $4, $5, $6, $7) WHERE kode_izin=$1 AND id_izin=$2 RETURNING ' +
                    'kode_izin, id_izin, token, user_key, status, id_user, last_login', process_data);
            }
            //Check data user_info di PSAT
            let check_user = await pool.query('Select id, id_profile_oss FROM ' + db_info_kepemilikan + 'WHERE id_profile_oss = $1', [oss.id_profile]);
            user_info = [
                oss.id_profile, oss.username, oss.kode_instansi, oss.jenis_identitas, oss.nomor_identitas, oss.nama,
                oss.email, oss.alamat, oss.telp, oss.status, oss.role, oss.flag_umk, oss.foto, oss.nama_kota,
                oss.jenis_perseroan, oss.flag_migrasi, oss.kantor, oss.unit_kerja, oss.npwp_perseroan,
                oss.kewenangan_izin, oss.data_nib, date
            ];
            if (check_user.rowCount <= 0) {
                query_data = await pool.query(
                    'INSERT INTO ' + db_info_kepemilikan +
                    '(id_profile_oss, username, kode_instansi, jenis_identitas, nomor_identitas, nama, email, alamat, telp, ' +
                    'status, role, flag_umk, foto, nama_kota, jenis_perseroan, flag_migrasi, kantor, unit_kerja, ' +
                    'npwp_perseroan, kewenangan_izin, data_nib, created)' +
                    'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, ' +
                    '$20, $21, $22) RETURNING *', user_info);
                pengguna = await pool.query(
                    'INSERT INTO ' + db_pengguna + ' (role, info_kepemilikan, created)' +
                    'VALUES ($1, $2, $3) RETURNING info_kepemilikan, role, created', ['USER', query_data.rows[0].id, date]);
            } else {
                query_data = await pool.query(
                    'UPDATE' + db_info_kepemilikan +
                    'SET (id_profile_oss, username, kode_instansi, jenis_identitas, nomor_identitas, nama, email, alamat, telp, ' +
                    'status, role, flag_umk, foto, nama_kota, jenis_perseroan, flag_migrasi, kantor, unit_kerja, ' +
                    'npwp_perseroan, kewenangan_izin, data_nib, update)' +
                    '= ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, ' +
                    '$20, $21, $22) WHERE id_profile_oss = $1 RETURNING *', user_info);
                pengguna = await pool.query(
                    'UPDATE ' + db_pengguna + ' SET (info_kepemilikan, role, created)' +
                    '= ($1, $2, $3) WHERE info_kepemilikan=$1 RETURNING ' +
                    'info_kepemilikan, role, created', [query_data.rows[0].id, 'USER', date]);
            }
            response.user = pengguna.rows[0];
            response.user_detail = query_data.rows[0];
            response.receiveNIB = process.rows[0];
            debug('get %o', response);
            return response;
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async send_license(body, user_key) {
        try {
            let response;
            const url = 'https://api-prd.oss.go.id/v1/kl/rba/receiveLicense';
            let oss = await oss_param.send_license(url, body, user_key);
            debug('get %o', response);
            return { status: 200, response: response };
        } catch (ex) {
            if (ex.response.data.responreceiveLicense.kode == 400) {
                return { status: '400', Error: ex.response.data.responreceiveLicense };
            }
            return { status: '400', Error: "" + ex };
        };
    }

    async send_license_final(body, user_key) {
        try {
            let response;
            const url = 'https://api-prd.oss.go.id/v1/kl/rba/receiveLicenseStatus';
            let oss = await oss_param.send_license_final(url, body, user_key);
            response = oss.data
            debug('get %o', response);
            return { status: 200, response: response };
        } catch (ex) {
            if (ex.response.data.responreceiveLicense.kode == 400) {
                return { status: '400', Error: ex.response.data.responreceiveLicense };
            }
            return { status: '400', Error: "" + ex };
        };
    }
}

module.exports = new OSSModel();