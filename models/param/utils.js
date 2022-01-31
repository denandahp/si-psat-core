const pool = require('../../libs/db');
var moment = require('moment-timezone');
var nodemailer = require('nodemailer');
var content = require('./content_email');
const dotenv = require('dotenv');
dotenv.config();


const db_proses_audit = 'audit.proses_audit';
const db_pengguna = 'pengguna.pengguna';
const db_notifikasi = 'notifikasi.notifikasi';
const db_history_sppb = 'sppb_psat.history_all_pengajuan';
const db_history_izin_edar = 'izin_edar.history_all_pengajuan';
const db_sekretariat = 'pengguna.list_sekretariat';
const db_pelaku_usaha = 'pengguna._listall_pelaku_usaha';



exports.limit_time = (limit) => {
    var d = new Date(Date.now());
    d.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
    d.setSeconds(d.getSeconds() + limit);
    var dd = d.getDate();
    var mm = d.getMonth() + 1;
    var y = d.getFullYear();
    var hour = d.getHours();
    var minute = d.getMinutes();
    var second = d.getSeconds();
    var FormattedDate = y + '-' + mm + '-' + dd + ' ' + hour + ':' + minute + ':' + second;
    return FormattedDate;
}

exports.date_now = () => {
    var date = moment().tz("Asia/jakarta").format();
    return date;
}

exports.time_format = () => {
    var d = new Date(Date.now());
    d.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
    var dd = d.getDate();
    var mm = d.getMonth() + 1;
    var y = d.getFullYear();
    var hour = d.getHours();
    var minute = d.getMinutes();
    var second = d.getSeconds();
    var FormattedDate = y + '-' + mm + '-' + dd;
    return String(FormattedDate);
}

exports.check_queryset = (queryset) => {
    if (queryset.rowCount <= 0) {
        throw new Error('Invalid id/data is empty. Check again your data query');
    }
}

exports.proses_code_all = (user, code_proses, role, proses_pengajuan, pengajuan, search) => {
    let code, proses, data_history, role_query, kolom_permohonan;

    if (role == 'AUDITOR') {
        role_query = 'tim_auditor'
    } else {
        role_query = 'tim_komtek'
    };

    if (pengajuan == 'SPPB_PSAT') {
        kolom_permohonan = 'jenis_permohonan'
    } else {
        kolom_permohonan = 'status_pengajuan'
    };

    if (role == 'PELAKU_USAHA') {
        code = 'Semua Proses'
        if (proses_pengajuan === undefined) {
            proses = 'id_pengguna=$1';
            data_history = [user];
        } else {
            proses = `id_pengguna=$1 AND ${kolom_permohonan}=$2`;
            data_history = [user, proses_pengajuan];
        };
    } else if (role == 'SUPERADMIN') {
        code = 'Semua Proses'
        if (proses_pengajuan === undefined) {
            proses = '';
        } else {
            proses = `${kolom_permohonan}=$1`;
            data_history = [proses_pengajuan];
        };
    } else {
        if (proses_pengajuan === undefined) {
            proses = `$1=ANY(${role_query})`;
            data_history = [user];
        } else {
            proses = `$1=ANY(${role_query}) AND ${kolom_permohonan}=$2`;
            data_history = [user, proses_pengajuan];
        }
    }
    if (pengajuan == 'SPPB_PSAT') {
        if (search !== undefined) {
            proses = proses + ` AND kode_pengajuan LIKE '%${search}%' OR nomor_sppb_psat_baru LIKE '%${search}%' `
        }
    } else {
        if (search !== undefined) {
            proses = proses + ` AND kode_pengajuan LIKE '%${search}%' OR sertifikat_izin_edar_sebelumnya LIKE '%${search}%' `
        }
    };
    return {
        filter: proses,
        data: data_history,
        code: code
    }

}

exports.proses_code = async(user, code_proses, role, proses_pengajuan, pengajuan, search) => {
    let code, proses, data_history, role_query, kolom_permohonan;
    if (role == 'AUDITOR') {
        role_query = 'tim_auditor'
    } else {
        role_query = 'tim_komtek'
    };

    if (pengajuan == 'SPPB_PSAT') {
        kolom_permohonan = 'jenis_permohonan'
    } else {
        kolom_permohonan = 'status_pengajuan'
    };

    if (role == 'PELAKU_USAHA') {
        if (proses_pengajuan === undefined) {
            proses = 'id_pengguna=$1 AND code_status_proses=$2';
            data_history = [user, code_proses];
        } else {
            proses = `id_pengguna=$1 AND code_status_proses=$2 AND ${kolom_permohonan}=$3`;
            data_history = [user, code_proses, proses_pengajuan];
        };
    } else if (role == 'SUPERADMIN') {
        if (proses_pengajuan === undefined) {
            proses = `code_status_proses=$1`;
            data_history = [code_proses, proses_pengajuan];
        } else {
            proses = `code_status_proses=$1 AND ${kolom_permohonan}=$2`;
            data_history = [code_proses, proses_pengajuan];
        };
    } else {
        if (proses_pengajuan === undefined) {
            proses = `$1=ANY(${role_query}) AND code_status_proses=$2`;
            data_history = [user, code_proses];
        } else {
            proses = `$1=ANY(${role_query}) AND code_status_proses=$2 AND ${kolom_permohonan}=$3`;
            data_history = [user, code_proses, proses_pengajuan];
        }
    }
    let query_code = await pool.query('SELECT * FROM ' + db_proses_audit + ' WHERE code=$1', [code_proses]);
    code = query_code.rows[0].status;

    if (pengajuan == 'SPPB_PSAT') {
        if (search !== undefined) {
            proses = proses + ` AND kode_pengajuan LIKE '%${search}%' OR nomor_sppb_psat_baru LIKE '%${search}%' `
        }
    } else {
        if (search !== undefined) {
            proses = proses + ` AND kode_pengajuan LIKE '%${search}%' OR sertifikat_izin_edar_sebelumnya LIKE '%${search}%' `
        }
    };
    return {
        filter: proses,
        data: data_history,
        code: code
    }
}

exports.check_username = async(queryset) => {
    let check_username = await pool.query('SELECT * FROM ' + db_pengguna + ' WHERE username=$1', [queryset.username]);
    if (check_username.rowCount > 0) {
        throw new Error('401');
    }
}

exports.pagination = async(page_query, limit_query, filter, data, query_select, database) => {
    let page = parseInt(page_query);
    let limit = parseInt(limit_query);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    let counts, res, results = {},
        err = [];
    var d = this.date_now();
    try {
        counts = await pool.query('SELECT COUNT (*)  FROM ' + database + `WHERE ${filter} `, data);
        if (endIndex <= counts.rows[0].count) {
            results.next = {
                page: page + 1,
                limit: limit
            }
        } else if (endIndex >= counts.rows[0].count) {
            results.next = {
                page: page + 1,
                limit: 0
            }
        } else { throw new Error('data kosong'); };

        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit
            }
        } else { results.previous = { page: 0, limit: limit } };
        results.total_query = counts.rows[0].count;
        results.max_page = Math.ceil(counts.rows[0].count / limit);
        res = await pool.query(`SELECT ${query_select} FROM ${database} WHERE ${filter} ORDER BY created DESC OFFSET ${startIndex} LIMIT ${limit};`, data);
        results.query = res.rows;
        results.date = d;
        return results;
    } catch (ex) {
        console.log('Enek seng salah iki ' + ex);
        return { "error": "data" + ex, "res": err };
    };
}

exports.plotting_id_pengguna = async(query_pengajuan) => {
    function mapping_id(item, index, arr) {
        arr[index] = item.id
    }

    let id_pengguna = [], pvtpp, superadmin;

    //-------------------------- Plotting Id Pengguna ---------------------------------------
    if (query_pengajuan.rows[0].code_status_proses == 10 ||
        query_pengajuan.rows[0].code_status_proses == 40 ||
        query_pengajuan.rows[0].code_status_proses == 50 ||
        query_pengajuan.rows[0].code_status_proses == 60) {
        superadmin = await pool.query('SELECT id FROM ' + db_sekretariat + ' WHERE role=$1', ['SUPERADMIN']);
        id_pengguna = superadmin.rows
        id_pengguna.forEach(mapping_id)
    } else if(query_pengajuan.rows[0].code_status_proses == 1){
        superadmin = await pool.query('SELECT id FROM ' + db_sekretariat + ' WHERE role=$1', ['SUPERADMIN']);
        id_pengguna = superadmin.rows
        id_pengguna.forEach(mapping_id)
        pvtpp = await pool.query('SELECT id FROM ' + db_sekretariat + ' WHERE role=$1', ['PVTPP']);
        id_pengguna = id_pengguna.concat(pvtpp.rows[0].id)
    } else if (query_pengajuan.rows[0].code_status_proses == 20 ||
        query_pengajuan.rows[0].code_status_proses == 30) {
        id_pengguna = query_pengajuan.rows[0].tim_auditor
        id_pengguna = id_pengguna.concat(query_pengajuan.rows[0].lead_auditor)
    } else if (query_pengajuan.rows[0].code_status_proses == 70) {
        superadmin = await pool.query('SELECT id FROM ' + db_sekretariat + ' WHERE role=$1', ['SUPERADMIN']);
        id_pengguna = superadmin.rows
        id_pengguna.forEach(mapping_id)
        id_pengguna = id_pengguna.concat(query_pengajuan.rows[0].id_pengguna)
    } else {
        id_pengguna = [query_pengajuan.rows[0].id_pengguna]
    }
    return id_pengguna;
}

exports.send_notification = async(id_pengajuan, jenis_pengajuan) => {
    try {
        function capitalizeFirstLetter(string) {
            let lower_string = string.toLowerCase()
            return lower_string[0].toUpperCase() + lower_string.slice(1);
        }
        let pesan, query_pengajuan, id_pengguna = [], jenis_permohonan;
        //-------------------------- Generate Pesan Notifikasi ---------------------------------------
        if (jenis_pengajuan == 'SPPB_PSAT') {
            query_pengajuan = await pool.query('SELECT * FROM ' + db_history_sppb + ' WHERE id_pengajuan=$1', [id_pengajuan]);
            pesan = capitalizeFirstLetter(query_pengajuan.rows[0].status_proses) + ' ' + query_pengajuan.rows[0].jenis_permohonan.toLowerCase() +
                ' SPPB PSAT dengan kode pengajuan ' + query_pengajuan.rows[0].kode_pengajuan
            jenis_permohonan = query_pengajuan.rows[0].jenis_permohonan.toLowerCase();
        } else if (jenis_pengajuan == 'IZIN_EDAR') {
            query_pengajuan = await pool.query('SELECT * FROM ' + db_history_izin_edar + ' WHERE id_pengajuan=$1', [id_pengajuan]);
            pesan = capitalizeFirstLetter(query_pengajuan.rows[0].status_proses) + ' ' + query_pengajuan.rows[0].status_pengajuan.toLowerCase() +
                ' IZIN EDAR PL dengan kode pengajuan ' + query_pengajuan.rows[0].kode_pengajuan
            jenis_permohonan = query_pengajuan.rows[0].status_pengajuan.toLowerCase();
        }
        id_pengguna = await this.plotting_id_pengguna(query_pengajuan)
        for (let i = 0; i < id_pengguna.length; i++) {
            let data_notifikasi = [id_pengguna[i], id_pengajuan, jenis_pengajuan, jenis_permohonan, pesan, this.date_now(), this.date_now()]
            await pool.query(
                ' INSERT INTO ' + db_notifikasi + ' (id_pengguna, id_pengajuan, jenis_pengajuan, jenis_permohonan, keterangan, created, update) ' +
                ' VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', data_notifikasi);
        }
        return pesan;
    } catch (err) {
        throw new Error(err.message);
    }
}

exports.check_data = async(data, data_optional) => {
    function mapping_id(item) {
        let var_name = item[0],
            pesan;
        if (data_optional != undefined || data_optional != null) {
            for (let i = 0; i < data_optional.length; i++) {
                if (item[0] == data_optional[i]) {
                    return;
                }
            }
        }
        if (item[1] == undefined || item[1] == "" || item[1] == " " || item[1] == null) {
            pesan = `${var_name} tidak boleh kosong`
            throw ({ pesan: pesan, code: '401' });
        }
    }
    var arr_data = Object.keys(data).map((key) => [key, data[key]]);
    arr_data.forEach(mapping_id)
}

exports.send_email = async(id_pengajuan, jenis_pengajuan) => {
    try {
        function capitalizeFirstLetter(string) {
            let lower_string = string.toLowerCase()
            return lower_string[0].toUpperCase() + lower_string.slice(1);
        }

        let query_pengajuan, subjectReceiver, textReceiver, emailReceiverList = [];
        //-------------------------- Generate Pesan Email ---------------------------------------
        if (jenis_pengajuan == 'SPPB_PSAT') {
            query_pengajuan = await pool.query('SELECT * FROM ' + db_history_sppb + ' WHERE id_pengajuan=$1', [id_pengajuan]);
            subjectReceiver = capitalizeFirstLetter(query_pengajuan.rows[0].status_proses) + ' ' + query_pengajuan.rows[0].jenis_permohonan.toLowerCase() +
                ' SPPB PSAT dengan kode pengajuan ' + query_pengajuan.rows[0].kode_pengajuan
        } else if (jenis_pengajuan == 'IZIN_EDAR') {
            query_pengajuan = await pool.query('SELECT * FROM ' + db_history_izin_edar + ' WHERE id_pengajuan=$1', [id_pengajuan]);
            subjectReceiver = capitalizeFirstLetter(query_pengajuan.rows[0].status_proses) + ' ' + query_pengajuan.rows[0].status_pengajuan.toLowerCase() +
                ' IZIN EDAR PL dengan kode pengajuan ' + query_pengajuan.rows[0].kode_pengajuan
        }
        let emailSender = process.env.EMAIL_USER;
        let passSender = process.env.EMAIL_PASSWORD;
        // let emailSender = 'denandahp@gmail.com';
        // let passSender = 'irwpuxsgcquneltv';
        var sender = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                user: emailSender,
                pass: passSender
            }
        });
        await sender.verify().then(console.log('sender verify')).catch(console.error);
        emailReceiverList = await this.plotting_email_pengguna(query_pengajuan, sender, subjectReceiver, emailSender)
        if (emailReceiverList == true){
            return subjectReceiver;
        }else{
            throw ({ pesan: err.message, code: '401' });
        }
    } catch (err) {
        throw ({ pesan: err.message, code: '401' });
    }
}

exports.plotting_email_pengguna = async(query_pengajuan, sender, subjectReceiver, emailSender) => {
    function mapping_email(item, index, arr) {
        arr[index] = item.email
    }

    async function send_email(email, pengajuan, role){
        let textReceiver 
        if(role == 'SUPERADMIN' || role == 'PVTPP'){
            textReceiver = content.content_superadmin(pengajuan)
        } else if (role == 'AUDITOR'){
            textReceiver = content.content_auditor(pengajuan)
        } else{
            textReceiver = content.content_pelaku_usaha(pengajuan)
        }
        var receiver = {
            from: emailSender,
            to: email,
            subject: subjectReceiver,
            html: textReceiver
        };
        await sender.sendMail(receiver)
            .then(info => {
                console.log(info.response);
            });
    }

    let email_pengguna = [], superadmin, auditor, id_auditor;

    //-------------------------- Plotting Email Pengguna ---------------------------------------
    if(query_pengajuan.rows[0].code_status_proses == 10 ||
        query_pengajuan.rows[0].code_status_proses == 40 ||
        query_pengajuan.rows[0].code_status_proses == 50 ||
        query_pengajuan.rows[0].code_status_proses == 60) {
            superadmin = await pool.query('SELECT id, email, role FROM ' + db_sekretariat + ' WHERE role=$1', ['SUPERADMIN']);
            email_pengguna = superadmin.rows
            email_pengguna.forEach(mapping_email)
            await send_email(email_pengguna, query_pengajuan.rows[0], 'SUPERADMIN')

            if(query_pengajuan.rows[0].code_status_proses == 40 ||
            query_pengajuan.rows[0].code_status_proses == 60){
                pengguna = await pool.query(
                    'SELECT email FROM ' + db_pelaku_usaha +
                    ' WHERE id=$1 AND role=$2', [query_pengajuan.rows[0].id_pengguna, 'PELAKU_USAHA']);
                email_pengguna = pengguna.rows[0].email;
                await send_email(email_pengguna, query_pengajuan.rows[0], 'PELAKU_USAHA');
            }

    }else if(query_pengajuan.rows[0].code_status_proses == 1){
        superadmin = await pool.query('SELECT id FROM ' + db_sekretariat + ' WHERE role=$1', ['SUPERADMIN']);
        email_pengguna = superadmin.rows;
        email_pengguna.forEach(mapping_email);
        await send_email(email_pengguna, query_pengajuan.rows[0], 'SUPERADMIN');

        pvtpp = await pool.query('SELECT id FROM ' + db_sekretariat + ' WHERE role=$1', ['PVTPP']);
        email_pengguna = pvtpp.rows[0].email;
        await send_email(email_pengguna, query_pengajuan.rows[0], 'PVTPP');
    } 
    else if (query_pengajuan.rows[0].code_status_proses == 20 ||
        query_pengajuan.rows[0].code_status_proses == 30) {
        id_auditor = query_pengajuan.rows[0].tim_auditor
        id_auditor = id_auditor.concat(query_pengajuan.rows[0].lead_auditor)
        auditor = await pool.query('SELECT * FROM ' + db_sekretariat + ` WHERE id=ANY (ARRAY[${String(id_auditor)}]) AND role='AUDITOR' AND is_deleted='false'`)
        email_pengguna = auditor.rows
        email_pengguna.forEach(mapping_email)
        await send_email(email_pengguna, query_pengajuan.rows[0], 'AUDITOR')

    } else if (query_pengajuan.rows[0].code_status_proses == 70) {
        superadmin = await pool.query('SELECT id, email, role FROM ' + db_sekretariat + ' WHERE role=$1', ['SUPERADMIN']);
        email_pengguna = superadmin.rows
        email_pengguna.forEach(mapping_email)
        await send_email(email_pengguna, query_pengajuan.rows[0], 'SUPERADMIN')
        pengguna = await pool.query(
            'SELECT email FROM ' + db_pelaku_usaha +
            ' WHERE id=$1 AND role=$2', [query_pengajuan.rows[0].id_pengguna, 'PELAKU_USAHA']);
        email_pengguna = pengguna.rows[0].email
        await send_email(email_pengguna, query_pengajuan.rows[0], 'PELAKU_USAHA')

    } else {
        pengguna = await pool.query(
            'SELECT email FROM ' + db_pelaku_usaha +
            ' WHERE id=$1 AND role=$2', [query_pengajuan.rows[0].id_pengguna, 'PELAKU_USAHA']);
        email_pengguna = [pengguna.rows[0].email]
        await send_email(email_pengguna, query_pengajuan.rows[0], 'PELAKU_USAHA')

    }
    return true;
}