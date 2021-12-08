const check_query = require('./param/utils.js');
const pool = require('../libs/db');
var format = require('pg-format');

const schemapet = '"audit"';
const schema_izin_edar = '"izin_edar"';
const proc_tim_audit = schemapet + '.' + '"penunjukan_tim_audit_izinedar_sekretariat"';
const proc_audit_doc = schemapet + '.' + '"audit_dokument_izinedar_auditor"';
const proc_sidang_komtek = schemapet + '.' + '"sidang_komtek_izinedar_sekretariat"';
const db_history_audit = schemapet + '.' + '"history_audit_izinedar"';
const db_history_pengajuan_izin_edar = schema_izin_edar + '.' + '"history_all_pengajuan"';
const db_proses_audit = schemapet + '.' + '"proses_audit"';


var date = new Date(Date.now());
date.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });


class PsatPlPerubahanModel {

    async penunjukkan_auditor(data) {
        try {
            let penunjukan_tim_audit;
            let data_penunjukan_tim_audit = [
                data.id_pengajuan, data.tanggal_penugasan, data.surat_tugas
            ];
            console.log(data)
            penunjukan_tim_audit = await pool.query(
                format('CALL ' + proc_tim_audit + `(%L,'{${data.lead_auditor}}' , '{${data.tim_auditor}}')`, data_penunjukan_tim_audit));

            return { status: '200', ketarangan: "Penunjukkan Tim Audit PSAT PL", data: penunjukan_tim_audit.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async audit_dokumen(data) {
        try {
            let audit_dokumen, data_audit_dokumen, data_sidang_komtek, sidang_komtek;
            if (data.proses == 'CLEAR') {
                data_audit_dokumen = [data.id_pengajuan, data.id_tim_audit, data.proses];
                audit_dokumen = await pool.query(format('CALL ' + proc_audit_doc + ' (%L)', data_audit_dokumen));

                data_sidang_komtek = [data.id_pengajuan, data.id_tim_komtek, 'REVIEW'];
                sidang_komtek = await pool.query(format('CALL ' + proc_sidang_komtek + ' (%L)', data_sidang_komtek));
            } else {
                data_audit_dokumen = [
                    data.id_pengajuan, data.id_tim_audit, data.proses, data.hasil_audit, JSON.stringify(data.keterangan)
                ];
                audit_dokumen = await pool.query(format('CALL ' + proc_audit_doc + ' (%L)', data_audit_dokumen));
            }

            return { status: '200', ketarangan: `${data.proses} AUDIT DOCUMENT PSAT PL`, data: audit_dokumen.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async audit_rekomendasi(data) {
        try {
            let sidang_komtek, data_sidang_komtek;
            data_sidang_komtek = [data.id_pengajuan, data.id_tim_komtek, data.proses, data.hasil_audit, JSON.stringify(data.keterangan)];
            sidang_komtek = await pool.query(format('CALL ' + proc_sidang_komtek + ' (%L)', data_sidang_komtek));
            return { status: '200', ketarangan: `${data.proses} SIDANG KOMTEK PSAT PL`, data: sidang_komtek.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async audit_history(id_pengajuan) {
        try {
            
            let history;
            history = await pool.query(
                ' SELECT id_pengajuan, id_audit, code_status_proses, status_proses, created, update, ' +
                ' id_tim_audit, tanggal_penugasan_tim_audit, surat_tugas_tim_audit, lead_auditor, tim_auditor, ' + 
                ' id_tim_komtek, tanggal_penugasan_tim_komtek, surat_tugas_tim_komtek, lead_komtek, tim_komtek, ' +
                ' id_audit_dokumen, mulai_audit_dokumen, tenggat_audit_dokumen, selesai_audit_dokumen, mulai_perbaikan_audit_dokumen, ' +
                ' tenggat_perbaikan_audit_dokumen, selesai_perbaikan_audit_dokumen, keterangan_audit_dokumen, hasil_audit_dokumen,' +
                ' id_sidang_komtek, mulai_sidang_komtek, tenggat_sidang_komtek, selesai_sidang_komtek, mulai_perbaikan_sidang_komtek, ' +
                ' tenggat_perbaikan_sidang_komtek, selesai_perbaikan_sidang_komtek, keterangan_sidang_komtek, hasil_sidang_komtek FROM' +
                db_history_audit + ' WHERE id_pengajuan=$1 ORDER BY created ASC', [id_pengajuan])
            check_query.check_queryset(history);
            return { status: '200', keterangan: `History Audit id Pengajuan ${id_pengajuan} PSAT PL`, data: history.rows };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async history_pengajuan_izin_edar(user, code_proses, role) {
        try {
            let history, role_query, code;
            if(role == 'AUDITOR'){
                role_query = 'tim_auditor'
            }else{
                role_query = 'tim_komtek'
            }
            if(user == 'all'){
                history = await pool.query(
                    ' SELECT id_pengajuan, id_pengguna, status_pengajuan, created, nomor_sppb_psat_baru, status_proses, ' +
                    ' tenggat_audit_auditor, tenggat_waktu_perbaikan FROM' + db_history_pengajuan_izin_edar)
            } else {
                if(code_proses == 'all'){
                    history = await pool.query(
                        ' SELECT id_pengajuan, id_pengguna, status_pengajuan, created, nomor_izin_edar, status_proses, code_status_proses, ' + 
                        ' id_audit_dokumen, mulai_audit_dokumen, tenggat_audit_dokumen, selesai_audit_dokumen, mulai_perbaikan_audit_dokumen, '+
                        ' tenggat_perbaikan_audit_dokumen, selesai_perbaikan_audit_dokumen, keterangan_audit_dokumen, hasil_audit_dokumen, ' +
                        ' id_sidang_komtek, mulai_sidang_komtek, tenggat_sidang_komtek, selesai_sidang_komtek, mulai_perbaikan_sidang_komtek, '+
                        ' tenggat_perbaikan_sidang_komtek, selesai_perbaikan_sidang_komtek, keterangan_sidang_komtek, hasil_sidang_komtek, ' +
                        ' id_tim_audit, tim_auditor, lead_auditor, tanggal_penugasan_tim_audit, surat_tugas_tim_audit, '+
                        ' id_tim_komtek, tim_komtek, lead_komtek, tanggal_penugasan_tim_komtek, surat_tugas_tim_komtek FROM'+ db_history_pengajuan_izin_edar + 
                        ` WHERE $1=ANY(${role_query})  ORDER BY created DESC`, [user])
                }else{
                    let query_code = await pool.query('SELECT * FROM ' + db_proses_audit + ' WHERE code=$1', [code_proses]);
                    code = query_code.rows[0].status
                    if(code_proses == '20' || code_proses == '21'){
                        history = await pool.query(
                            ' SELECT id_pengajuan, id_pengguna, status_pengajuan, created, nomor_izin_edar, status_proses, code_status_proses, ' + 
                            ' id_audit_dokumen, mulai_audit_dokumen, tenggat_audit_dokumen, selesai_audit_dokumen, mulai_perbaikan_audit_dokumen, '+
                            ' tenggat_perbaikan_audit_dokumen, selesai_perbaikan_audit_dokumen, keterangan_audit_dokumen, hasil_audit_dokumen, ' +
                            ' id_tim_audit, tim_auditor, lead_auditor, tanggal_penugasan_tim_audit, surat_tugas_tim_audit, '+
                            ' id_tim_komtek, tim_komtek, lead_komtek, tanggal_penugasan_tim_komtek, surat_tugas_tim_komtek FROM'+ db_history_pengajuan_izin_edar + 
                            ` WHERE $1=ANY(${role_query}) AND code_status_proses=$2  ORDER BY created DESC`, [user, code_proses])   
                    }else if (code_proses == '40' || code_proses == '41'){
                        history = await pool.query(
                            ' SELECT id_pengajuan, id_pengguna, status_pengajuan, created, nomor_izin_edar, status_proses, code_status_proses, ' + 
                            ' id_sidang_komtek, mulai_sidang_komtek, tenggat_sidang_komtek, selesai_sidang_komtek, mulai_perbaikan_sidang_komtek, '+
                            ' tenggat_perbaikan_sidang_komtek, selesai_perbaikan_sidang_komtek, keterangan_sidang_komtek, hasil_sidang_komtek, ' +
                            ' id_tim_audit, tim_auditor, lead_auditor, tanggal_penugasan_tim_audit, surat_tugas_tim_audit, '+
                            ' id_tim_komtek, tim_komtek, lead_komtek, tanggal_penugasan_tim_komtek, surat_tugas_tim_komtek FROM '+ db_history_pengajuan_izin_edar + 
                            ` WHERE $1=ANY(${role_query}) AND code_status_proses=$2  ORDER BY created DESC`, [user, code_proses])
                    }else{
                        history = await pool.query(
                            ' SELECT id_pengajuan, id_pengguna, status_pengajuan, created, nomor_izin_edar, status_proses, code_status_proses FROM ' + 
                            db_history_pengajuan_izin_edar + ` WHERE $1=ANY(${role_query}) AND code_status_proses=$2 ORDER BY created DESC`, [user, code_proses])
                    }
                }
            }
            return { status: '200', keterangan: `History SPPB PSAT id ${user} Code Proses: ${code}` , data: history.rows };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

}
module.exports = new PsatPlPerubahanModel();