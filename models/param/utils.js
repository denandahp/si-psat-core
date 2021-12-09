const pool = require('../../libs/db');

const db_proses_audit = 'audit.proses_audit';


exports.limit_time = (limit)=> {
    var d = new Date(Date.now());
    d.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
    d.setSeconds(d.getSeconds() + limit);
    var dd = d.getDate();var mm = d.getMonth() + 1;var y = d.getFullYear();var hour = d.getHours();var minute = d.getMinutes();var second = d.getSeconds();
    var FormattedDate = y + '-'+ mm + '-'+ dd + ' ' + hour+':'+minute+':'+second;
    return FormattedDate;
}

exports.date_now = ()=> {
    var date = new Date(Date.now());
    date.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
    return date;
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