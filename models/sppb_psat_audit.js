const check_query = require('./param/utils.js');
const pool = require('../libs/db');
var format = require('pg-format');

const schemapet = '"audit"';
const proc_tim_audit = schemapet + '.' + '"penunjukan_tim_audit_sekretariat"';
const proc_tim_komtek = schemapet + '.' + '"penunjukan_tim_komtek_sekretariat"';
const proc_audit_doc = schemapet + '.' + '"audit_dokument_psat_auditor"';
const proc_audit_lapang = schemapet + '.' + '"audit_lapang_psat_auditor"';
const proc_sidang_komtek = schemapet + '.' + '"sidang_komtek_sekretariat"';
const db_history_audit = schemapet + '.' + '"history_audit_psat"';


var date = new Date(Date.now());
date.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });


class PsatPlPerubahanModel {

    async penunjukkan_auditor(data) {
        try {
            let penunjukan_tim_audit;
            let data_penunjukan_tim_audit = [
                data.id_pengajuan, data.tanggal_penugasan, data.surat_tugas];
            console.log(data)
            penunjukan_tim_audit = await pool.query(
                format('CALL ' + proc_tim_audit + `(%L,'{${data.lead_auditor}}' , '{${data.tim_auditor}}')`, data_penunjukan_tim_audit));

            return { status: '200', ketarangan: "Penunjukkan Tim Audit", data: penunjukan_tim_audit.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async audit_dokumen(data) {
        try {
            let audit_dokumen, data_audit_dokumen, audit_lapang, data_audit_lapang ;
            if (data.proses == 'CLEAR'){
                data_audit_dokumen = [data.id_pengajuan, data.id_tim_audit, data.proses];
                audit_dokumen = await pool.query(format('CALL ' + proc_audit_doc + ' (%L)', data_audit_dokumen));
                console.log("OKE")

                data_audit_lapang = [data.id_pengajuan, data.id_tim_audit, 'REVIEW'];
                audit_lapang = await pool.query(format('CALL ' + proc_audit_lapang + ' (%L)', data_audit_lapang));
            }else{
                data_audit_dokumen = [data.id_pengajuan, data.id_tim_audit, data.proses, JSON.stringify(data.keterangan)];
                audit_dokumen = await pool.query(format('CALL ' + proc_audit_doc + ' (%L)', data_audit_dokumen));
            }

            return { status: '200', ketarangan: `${data.proses} AUDIT DOCUMENT `, data: audit_dokumen.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async audit_lapang(data) {
        try {
            let audit_lapang, data_audit_lapang ;
            data_audit_lapang = [data.id_pengajuan, data.id_tim_audit, data.proses, JSON.stringify(data.keterangan)];
            audit_lapang = await pool.query(format('CALL ' + proc_audit_lapang + ' (%L)', data_audit_lapang));
            return { status: '200', ketarangan: `${data.proses} AUDIT LAPANG `, data: audit_lapang.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async penunjukkan_tim_komtek(data) {
        try {
            let penunjukan_tim_komtek;
            let data_penunjukan_tim_komtek = [data.id_pengajuan, data.tanggal_penugasan, data.surat_tugas];
            penunjukan_tim_komtek = await pool.query(
                format('CALL ' + proc_tim_komtek + ` (%L, '{${data.lead_komtek}}', '{${data.tim_komtek}}')`, data_penunjukan_tim_komtek));
            return { status: '200', ketarangan: "Penunjukkan Tim Komtek", data: penunjukan_tim_komtek.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async audit_rekomendasi(data) {
        try {
            let sidang_komtek, data_sidang_komtek ;
            data_sidang_komtek = [data.id_pengajuan, data.id_tim_komtek, data.proses, JSON.stringify(data.keterangan)];
            sidang_komtek = await pool.query(format('CALL ' + proc_sidang_komtek + ' (%L)', data_sidang_komtek));
            return { status: '200', ketarangan: `${data.proses} SIDANG KOMTEK `, data: sidang_komtek.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async audit_history(id_pengajuan) {
        try {
            let history;
            history = await pool.query(
                ' SELECT id_pengajuan, id_audit, status_proses, created, update' +
                ' id_tim_audit, tanggal_penugasan_tim_audit, surat_tugas_tim_audit, lead_auditor, tim_auditor' + 
                ' id_tim_komtek, tanggal_penugasan_tim_komtek, surat_tugas_tim_komtek, lead_komtek, tim_komtek' +
                ' id_audit_dokumen, mulai_audit_dokumen, tenggat_audit_dokumen, selesai_audit_dokumen, mulai_perbaikan_audit_dokumen'+
                ' tenggat_perbaikan_audit_dokumen, selesai_perbaikan_audit_dokumen, keterangan_audit_dokumen, ' +
                ' id_audit_lapang, mulai_audit_lapang, tenggat_audit_lapang, selesai_audit_lapang, mulai_perbaikan_audit_lapang'+
                ' tenggat_perbaikan_audit_lapang, selesai_perbaikan_audit_lapang, keterangan_audit_lapang, ' +
                ' id_sidang_komtek, mulai_sidang_komtek, tenggat_sidang_komtek, selesai_sidang_komtek, mulai_perbaikan_sidang_komtek'+
                ' tenggat_perbaikan_sidang_komtek, selesai_perbaikan_sidang_komtek, keterangan_sidang_komtek FROM' + db_history_audit + 
                ' WHERE id_pengajuan=$1 ORDER BY created ASC', [id_pengajuan])
            check_query.check_queryset(history);
            return { status: '200', keterangan: `History Audit id Pengajuan ${id_pengajuan}` , data: history.rows };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

}
module.exports = new PsatPlPerubahanModel();