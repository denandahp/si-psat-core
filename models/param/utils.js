const pool = require('../../libs/db');

const db_proses_audit = 'audit.proses_audit';
const db_pengguna = 'pengguna.pengguna';



exports.limit_time = (limit)=> {
    var d = new Date(Date.now());
    d.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
    d.setSeconds(d.getSeconds() + limit);
    var dd = d.getDate();var mm = d.getMonth() + 1;var y = d.getFullYear();var hour = d.getHours();var minute = d.getMinutes();var second = d.getSeconds();
    var FormattedDate = y + '-'+ mm + '-'+ dd + ' ' + hour+':'+minute+':'+second;
    return FormattedDate;
}

exports.date_now = ()=> {
    var d = new Date(Date.now());
    var dd = d.getDate();var mm = d.getMonth() + 1;var y = d.getFullYear();var hour = d.getHours();var minute = d.getMinutes();var second = d.getSeconds();
    var FormattedDate = y + '-'+ mm + '-'+ dd + ' ' + hour + ':'+ minute + ':'+ second;
    return FormattedDate;
}

exports.time_format = ()=> {
    var d = new Date(Date.now());
    d.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
    var dd = d.getDate();var mm = d.getMonth() + 1;var y = d.getFullYear();var hour = d.getHours();var minute = d.getMinutes();var second = d.getSeconds();
    var FormattedDate = y + '-'+ mm + '-'+ dd;
    return String(FormattedDate);
}

exports.check_queryset = (queryset)=> {
    if (queryset.rowCount <= 0){
        throw  new Error('Invalid id/data is empty. Check again your data query');
    }
}

exports.proses_code_all = (user, code_proses, role, proses_pengajuan, pengajuan)=> {
    let code, proses, data_history, role_query, kolom_permohonan;

    if(role == 'AUDITOR'){
        role_query = 'tim_auditor'
    }else{
        role_query = 'tim_komtek'
    };

    if(pengajuan == 'SPPB_PSAT'){
        kolom_permohonan = 'jenis_permohonan'
    }else{
        kolom_permohonan = 'status_pengajuan'
    };

    if(role == 'PELAKU_USAHA'){
        code = 'Semua Proses'
        if(proses_pengajuan === undefined){
            proses = 'id_pengguna=$1';
            data_history = [user];
        }else{
            proses = `id_pengguna=$1 AND ${kolom_permohonan}=$2`;
            data_history = [user, proses_pengajuan];
        };
    }else if(role == 'SUPERADMIN'){
        code = 'Semua Proses'
        if(proses_pengajuan === undefined){
            proses = '';
        }else{
            proses = `${kolom_permohonan}=$1`;
            data_history = [proses_pengajuan];
        };
    }else{
        if(proses_pengajuan === undefined){
            proses = `$1=ANY(${role_query})`;
            data_history = [user];                            
        }else{
            proses = `$1=ANY(${role_query}) AND ${kolom_permohonan}=$2`;
            data_history = [user, proses_pengajuan];
        }
    }

    return {
        filter: proses,
        data: data_history,
        code: code
    }

}

exports.proses_code = async (user, code_proses, role, proses_pengajuan, pengajuan)=> {
    let code, proses, data_history, role_query, kolom_permohonan;
    if(role == 'AUDITOR'){
        role_query = 'tim_auditor'
    }else{
        role_query = 'tim_komtek'
    };

    if(pengajuan == 'SPPB_PSAT'){
        kolom_permohonan = 'jenis_permohonan'
    }else{
        kolom_permohonan = 'status_pengajuan'
    };

    if(role == 'PELAKU_USAHA'){
        if(proses_pengajuan === undefined){
            proses = 'id_pengguna=$1 AND code_status_proses=$2';
            data_history = [user, code_proses];
        }else{
            proses = `id_pengguna=$1 AND code_status_proses=$2 AND ${kolom_permohonan}=$3`;
            data_history = [user, code_proses, proses_pengajuan];
        };
    }else if(role == 'SUPERADMIN'){
        if(proses_pengajuan === undefined){
            proses = `code_status_proses=$1`;
            data_history = [code_proses, proses_pengajuan];
        }else{
            proses = `code_status_proses=$1 AND ${kolom_permohonan}=$2`;
            data_history = [code_proses, proses_pengajuan];
        };
    }else{
        if(proses_pengajuan === undefined){
            proses = `$1=ANY(${role_query}) AND code_status_proses=$2`;
            data_history = [user, code_proses];
        }else{
            proses = `$1=ANY(${role_query}) AND code_status_proses=$2 AND ${kolom_permohonan}=$3`;
            data_history = [user, code_proses, proses_pengajuan];
        }
    }
    let query_code = await pool.query('SELECT * FROM ' + db_proses_audit + ' WHERE code=$1', [code_proses]);
    code = query_code.rows[0].status;

    return {
        filter: proses,
        data: data_history,
        code: code
    }
}

exports.check_username = async (queryset)=> {
    let check_username = await pool.query('SELECT * FROM ' + db_pengguna + ' WHERE username=$1', [queryset.username]);
    if (check_username.rowCount > 0){
        throw new Error('401');
    }
}

exports.pagination = async (page_query, limit_query, filter, data, query_select, database)=> {
    let page = parseInt(page_query); let limit = parseInt(limit_query);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    let counts, res, results = {}, err = [];
    var d = this.date_now();
    try{
    counts = await pool.query('SELECT COUNT (*)  FROM ' + database +  `WHERE ${filter} `, data);
    if (endIndex <= counts.rows[0].count) {
        results.next = {
            page: page + 1,
            limit: limit
        }
    }else if(endIndex >= counts.rows[0].count){
        results.next = {
            page: page + 1,
            limit: 0
        }
    }else{ throw new Error('data kosong');};

    if (startIndex > 0) {
        results.previous = {
            page: page - 1,
            limit: limit
        }
    }else{results.previous ={ page : 0, limit: limit} };
    results.total_query = counts.rows[0].count;
    results.max_page = Math.ceil(counts.rows[0].count/limit);
    res = await pool.query(`SELECT ${query_select} FROM ${database} WHERE ${filter} ORDER BY created DESC OFFSET ${startIndex} LIMIT ${limit};`,data);
    results.query = res.rows;
    results.date = d;
    return results;
    }catch(ex){
    console.log('Enek seng salah iki ' + ex);
    return {"error": "data" + ex, "res" : err};
    };
}
