const debug = require('debug')('app:model:sppb_psat');
const pool = require('../libs/db');



var date = new Date(Date.now());
date.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });

class getSummary {
    async view_sppb() {
        try {
            let view = await pool.query("SELECT id_pengajuan,kode_pengajuan,id_pengguna,status_proses,  'SPPB-PSAT' as jenis_perizinan, jenis_permohonan,detail_tim_auditor, created,update  FROM sppb_psat.history_all_pengajuan WHERE status_aktif=true AND code_status_proses != 70 OR code_status_proses !=99 ORDER BY update;");

            return view.rows;
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async view_izinedar() {
        try {
            let view = await pool.query("SELECT id_pengajuan,kode_pengajuan,id_pengguna,status_proses,  'IZIN-EDAR' as jenis_perizinan,  status_pengajuan, nama_dagang, nama_latin, nama_merek, jenis_kemasan, detail_tim_auditor, created,update   FROM izin_edar.history_all_pengajuan WHERE status_aktif=true AND code_status_proses != 70 OR code_status_proses !=99 ORDER BY update;");

            return view.rows;
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

}
module.exports = new getSummary();