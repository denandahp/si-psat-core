const check_query = require('./param/utils.js');
const pool = require('../libs/db');
var format = require('pg-format');

const schemapet = '"audit"';
const proc_tim_audit = schemapet + '.' + '"penunjukan_tim_audit_sekretariat"';
const proc_audit_doc = schemapet + '.' + '"audit_dokument_psat_auditor"';
const proc_audit_lapang = schemapet + '.' + '"audit_lapang_psat_auditor"';
const proc_tim_komtek = schemapet + '.' + '"penunjukan_tim_komtek_sekretariat"';




var date = new Date(Date.now());
date.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });


class PsatPlPerubahanModel {

    async penunjukkan_auditor(data) {
        try {
            let penunjukan_tim_audit;
            let data_penunjukan_tim_audit = [
                data.id_pengajuan, data.tanggal_penugasan, data.surat_tugas, 
                data.lead_auditor, data.tim_auditor];
            penunjukan_tim_audit = await pool.query(
                format('CALL ' + proc_tim_audit + ' (%L)', data_penunjukan_tim_audit));

            return { status: '200', ketarangan: "Penunjukkan Tim Audit", data: penunjukan_tim_audit };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async audit_dokumen(data) {
        try {
            let audit_dokumen, data_audit_dokumen, audit_lapang, data_audit_lapang ;
            if (data.proses == 'CLEAR'){
                data_audit_dokumen = [data.id_pengajuan, data.id_tim_audit, data.proses, data.keterangan];
                audit_dokumen = await pool.query(format('CALL ' + proc_audit_doc + ' (%L)', data_audit_dokumen));

                data_audit_lapang = [data.id_pengajuan, data.id_tim_audit, 'REVIEW'];
                audit_lapang = await pool.query(format('CALL ' + proc_audit_lapang + ' (%L)', data_audit_dokumen));
            }else{
                data_audit_dokumen = [data.id_pengajuan, data.id_tim_audit, data.proses, data.keterangan];
                audit_dokumen = await pool.query(format('CALL ' + proc_audit_doc + ' (%L)', data_audit_dokumen));
            }

            return { status: '200', ketarangan: `${data.proses} AUDIT DOCUMENT `, data: audit_dokumen };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async audit_lapang(data) {
        try {
            let audit_lapang, data_audit_lapang ;
            data_audit_lapang = [data.id_pengajuan, data.id_tim_audit, data.proses, data.keterangan];
            audit_lapang = await pool.query(format('CALL ' + proc_audit_lapang + ' (%L)', data_audit_dokumen));
            return { status: '200', ketarangan: `${data.proses} AUDIT LAPANG `, data: audit_lapang };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async penunjukkan_tim_komtek(data) {
        try {
            let penunjukan_tim_komtek;
            let data_penunjukan_tim_komtek = [
                data.id_pengajuan, data.tanggal_penugasan, data.surat_tugas, 
                data.lead_auditor, data.tim_auditor];
            penunjukan_tim_komtek = await pool.query(
                format('CALL ' + proc_tim_komtek + ' (%L)', data_penunjukan_tim_komtek));
            return { status: '200', ketarangan: "Penunjukkan Tim Komtek", data: penunjukan_tim_komtek };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

}
module.exports = new PsatPlPerubahanModel();