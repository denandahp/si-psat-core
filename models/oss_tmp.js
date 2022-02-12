const debug = require('debug')('app:model:oss');
const dotenv = require('dotenv');
const oss_param = require('./param/oss.js');
const pool = require('../libs/db');
const check_query = require('./param/utils.js');

const schema_public = '"public"';
const schema_pengguna = '"pengguna"';
const db_oss = schema_public + '.' + '"oss"';
const db_info_kepemilikan = schema_pengguna + '.' + '"info_kepemilikan"';
const db_pengguna = schema_pengguna + '.' + '"pengguna"';

dotenv.config();
const crypto = require('crypto')
const md5 = require('md5');
const { param } = require('../routes/oss.js');

var date = check_query.date_now();

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
            let value = [token, data.dataNIB.id_izin, data.dataNIB.kd_izin, data.dataNIB.no_id_user_proses, data.dataNIB, data.nib, date];
            response = await pool.query('INSERT INTO ' + db_oss + '(token, id_izin, kode_izin, no_identitas, receive_nib, no_nib, created)' +
                'VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id_izin, kode_izin, no_identitas', value);
            debug('get %o', response);
            return { status: 200, keterangan: "success" };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async pelaku_usaha(data, access_token) {
        try {
            let response = {};
            let token = await oss_param.generate_token('userinfo')
            let query_data, user_info, pengguna;
            const url = `${process.env.MIDOSS_URL}/userInfoToken`;
            const x_sm_key = process.env.X_SM_KEY
            const username = process.env.OSS_USERNAME
            let oss = await oss_param.user_info(url, data.kd_izin, username, x_sm_key, token, access_token);
            if (oss.status == false || oss.OSS_result.status == 401) {
                return {
                    status: 400,
                    keterangan: oss
                }
            };
            //Check data user_info di PSAT
            oss = oss.OSS_result.data;
            let check_user = await pool.query('Select id, id_profile_oss, nomor_identitas FROM ' + db_info_kepemilikan + 'WHERE nomor_identitas = $1', [oss.nomor_identitas]);
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
                    'VALUES ($1, $2, $3) RETURNING id, info_kepemilikan, role, created', ['PELAKU_USAHA', query_data.rows[0].id, date]);
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
                    'id, info_kepemilikan, role, created', [query_data.rows[0].id, 'PELAKU_USAHA', date]);
            }
            response.user = pengguna.rows[0];
            response.user_detail = query_data.rows[0];
            debug('get %o', response);
            return response;
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }


    async get_data_license_status(param) {
        try {
            let result = await (await pool.query('SELECT * FROM public.data_nib WHERE no_identitas= $1 AND id_izin =  $2', param)).rows[0];

            let data_checklist = await result.receive_nib.data_checklist.find(item => {

                return item.id_izin == result.id_izin
            })

            let data = {
                nib: result.receive_nib.nib,
                id_produk: data_checklist.id_produk,
                id_proyek: data_checklist.id_proyek,
                kd_izin: result.kode_izin,
                id_izin: result.id_izin,
                oss_id: result.oss_id,
                kd_instansi: '018'


            }
            return data
        } catch (ex) {

            return { status: '400', Error: "" + ex };
        };
    }

    async get_data_license(param) {
        console.log(param)
        try {
            let result = await (await pool.query('SELECT * FROM public.data_nib WHERE no_identitas= $1 AND id_izin =  $2', param)).rows[0];

            let data_checklist = await result.receive_nib.data_checklist.find(item => {

                return item.id_izin == result.id_izin
            })

            let data = {
                nib: result.receive_nib.nib,
                id_produk: data_checklist.id_produk,
                id_proyek: data_checklist.id_proyek,
                kd_izin: result.kode_izin,
                id_izin: result.id_izin,
                oss_id: result.oss_id,
                kd_daerah: result.receive_nib.kd_daerah,
                kewenangan: result.receive_nib.kewenangan


            }
            return data
        } catch (ex) {

            return { status: '400', Error: "" + ex };
        };
    }

    async send_license(body, user_key) {
        try {

            const url = 'http://izinusaha.pertanian.go.id/midoss/api/services-stg/receiveLicense';
            const x_sm_key = '35d3d08c3d7b7f445ceb8e726a87b26c'
            let oss = await oss_param.send_license(url, body, user_key, x_sm_key);

            return oss;
        } catch (ex) {

            return { status: '400', Error: "" + ex };
        };
    }

    async send_license_status(body, user_key) {
        try {

            const url = 'http://izinusaha.pertanian.go.id/midoss/api/services-stg/receiveLicenseStatus';
            const x_sm_key = '35d3d08c3d7b7f445ceb8e726a87b26c'
            let oss = await oss_param.send_license_status(url, body, user_key, x_sm_key);

            return oss;
        } catch (ex) {

            return { status: '400', Error: "" + ex };
        };
    }

    async send_fileDS(body, user_key) {
        try {

            const url = 'http://izinusaha.pertanian.go.id/midoss/api/services-stg/receiveFileDS';
            const x_sm_key = '35d3d08c3d7b7f445ceb8e726a87b26c'
            let oss = await oss_param.send_fileDS(url, body, user_key, x_sm_key);

            return oss;
        } catch (ex) {

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

    async get_list_izin_oss(no_identitas, kode_izin) {
        try {
            let izin_oss = await pool.query(
                'SELECT id, kode_izin, id_izin, no_identitas FROM' + db_oss +
                ' WHERE no_identitas=$1 AND kode_izin=$2 ORDER BY id DESC', [no_identitas, kode_izin])
            check_query.check_queryset(izin_oss);
            debug('get %o', izin_oss);
            return { status: '200', keterangan: `List id izin oss dengan kode izin ${kode_izin}`, data: izin_oss.rows };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async get_izn_by_idpengguna(id_pengajuan, tipe_permohonan) {
        try {
            let result
            if (tipe_permohonan == 'IZIN-EDAR') {
                result = await pool.query('SELECT  id_izin, no_identitas FROM izin_edar.history_all_pengajuan WHERE id_pengajuan=$1 ', [id_pengajuan])
            } else {
                result = await pool.query('SELECT  id_izin, no_identitas FROM sppb_psat.history_all_pengajuan WHERE id_pengajuan=$1 ', [id_pengajuan])
            }

            return result.rows[0]
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };

    }
}

module.exports = new OSSModel();