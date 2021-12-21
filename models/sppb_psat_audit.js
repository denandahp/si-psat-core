const check_query = require('./param/utils.js');
const pool = require('../libs/db');
var format = require('pg-format');

const schemapet = '"audit"';
const schema = '"sppb_psat"';
const proc_tim_audit = schemapet + '.' + '"penunjukan_tim_audit_sekretariat"';
const proc_tim_komtek = schemapet + '.' + '"penunjukan_tim_komtek_sekretariat"';
const proc_audit_doc = schemapet + '.' + '"audit_dokument_psat_auditor"';
const proc_audit_lapang = schemapet + '.' + '"audit_lapang_psat_auditor"';
const proc_sidang_komtek = schemapet + '.' + '"sidang_komtek_sekretariat"';
const proc_pembayaran_pnbp = schemapet + '.' + '"pembayaran_pnbp_psat"';
const proc_dokumen_ditolak = schemapet + '.' + '"dokumen_psat_ditolak"';
const db_history_audit = schemapet + '.' + '"history_audit_psat"';
const db_proses_audit = schemapet + '.' + '"proses_audit"';
const db_history_pengajuan = schema + '.' + '"history_all_pengajuan"';


var date = new Date(Date.now());
date.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });


class PsatPlPerubahanModel {

    async penunjukkan_auditor(data) {
        try {
            let penunjukan_tim_audit;
            let data_penunjukan_tim_audit = [
                data.id_pengajuan, data.tanggal_penugasan, data.surat_tugas
            ];
            penunjukan_tim_audit = await pool.query(
                format('CALL ' + proc_tim_audit + `(%L,'{${data.lead_auditor}}' , '{${data.tim_auditor}}', `+
                ` '${JSON.stringify(data.keterangan)}' )`, data_penunjukan_tim_audit));

            return { status: '200', ketarangan: "Penunjukkan Tim Audit", data: penunjukan_tim_audit.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async audit_dokumen(data) {
        try {
            let audit_dokumen, data_audit_dokumen, audit_lapang, data_audit_lapang;
            if (data.proses == 'CLEAR') {
                data_audit_dokumen = [data.id_pengajuan, data.id_tim_audit, data.proses];
                audit_dokumen = await pool.query(format('CALL ' + proc_audit_doc + ' (%L)', data_audit_dokumen));

                data_audit_lapang = [data.id_pengajuan, data.id_tim_audit, 'REVIEW'];
                audit_lapang = await pool.query(format('CALL ' + proc_audit_lapang + ' (%L)', data_audit_lapang));
            } else {
                data_audit_dokumen = [
                    data.id_pengajuan, data.id_tim_audit, data.proses, data.hasil_audit, JSON.stringify(data.keterangan)
                ];
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
            let audit_lapang, data_audit_lapang, sidang_komtek, data_sidang_komtek;
            if (data.proses == 'CLEAR') {
                data_audit_lapang = [data.id_pengajuan, data.id_tim_audit, data.proses];
                audit_lapang = await pool.query(format('CALL ' + proc_audit_lapang + ' (%L)', data_audit_lapang));

                data_sidang_komtek = [data.id_pengajuan, data.id_tim_komtek, 'REVIEW', data.bahan_komtek];
                sidang_komtek = await pool.query(format('CALL ' + proc_sidang_komtek + ' (%L)', data_sidang_komtek));
            } else {
                data_audit_lapang = [data.id_pengajuan, data.id_tim_audit, data.proses, data.hasil_audit, JSON.stringify(data.keterangan)];
                audit_lapang = await pool.query(format('CALL ' + proc_audit_lapang + ' (%L)', data_audit_lapang));
            }
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
            let sidang_komtek, data_sidang_komtek;
            data_sidang_komtek = [data.id_pengajuan, data.id_tim_komtek, data.proses, data.bahan_komtek, data.hasil_audit, JSON.stringify(data.keterangan)];
            sidang_komtek = await pool.query(format('CALL ' + proc_sidang_komtek + ' (%L)', data_sidang_komtek));
            return { status: '200', ketarangan: `${data.proses} SIDANG KOMTEK `, data: sidang_komtek.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async pembayaran_pnbp(data) {
        try {
            let pembayaran_pnbp, data_pembayaran_pnbp;
            data_pembayaran_pnbp = [data.id_pengajuan, data.proses, data.keterangan, data.bukti_pembayaran];
            console.log(data_pembayaran_pnbp)

            pembayaran_pnbp = await pool.query(format('CALL ' + proc_pembayaran_pnbp + ' (%L)', data_pembayaran_pnbp));
            return { 
                status: '200',
                ketarangan: `${data.proses} PEMBAYARAN PNBP SPPB PSAT id ${data.id_pengajuan}`,
                data: pembayaran_pnbp.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async dokumen_ditolak(data) {
        try {
            let dokumen_ditolak, data_dokumen_ditolak;
            data_dokumen_ditolak = [data.id_pengajuan, data.proses, data.dokumen_ditolak, data.keterangan];
            dokumen_ditolak = await pool.query(format('CALL ' + proc_dokumen_ditolak + ' (%L)', data_dokumen_ditolak));
            return { 
                status: '200',
                ketarangan: `${data.proses} DOKUMEN SPPB PSAT DITOLAK id ${data.id_pengajuan}`,
                data: dokumen_ditolak.rows[0] };
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
                ' tenggat_perbaikan_audit_dokumen, selesai_perbaikan_audit_dokumen, keterangan_audit_dokumen, hasil_audit_dokumen, ' +
                ' id_audit_lapang, mulai_audit_lapang, tenggat_audit_lapang, selesai_audit_lapang, mulai_perbaikan_audit_lapang, ' +
                ' tenggat_perbaikan_audit_lapang, selesai_perbaikan_audit_lapang, keterangan_audit_lapang, hasil_audit_lapang, ' +
                ' id_sidang_komtek, mulai_sidang_komtek, tenggat_sidang_komtek, selesai_sidang_komtek, mulai_perbaikan_sidang_komtek, ' +
                ' tenggat_perbaikan_sidang_komtek, selesai_perbaikan_sidang_komtek, keterangan_sidang_komtek, hasil_sidang_komtek FROM' +
                db_history_audit + ' WHERE id_pengajuan=$1 ORDER BY created ASC', [id_pengajuan])
            check_query.check_queryset(history);
            return { status: '200', keterangan: `History Audit id Pengajuan ${id_pengajuan}`, data: history.rows };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async history_pengajuan_sppb_psat(user, code_proses, role) {
        try {
            let history, role_query, code;
            if(role == 'AUDITOR'){
                role_query = 'tim_auditor'
            }else{
                role_query = 'tim_komtek'
            }
            if(user == 'all'){
                history = await pool.query(
                    ' SELECT id_pengajuan, id_pengguna, jenis_permohonan, created, nomor_sppb_psat_baru, status_proses, ' +
                    ' tenggat_audit_auditor, tenggat_waktu_perbaikan, nama_perusahaan, alamat_perusahaan, keterangan FROM' + db_history_pengajuan)
            } else {
                if(code_proses == 'all'){
                    history = await pool.query(
                        ' SELECT id_pengajuan, id_pengguna, jenis_permohonan, created, nomor_sppb_psat_baru, status_proses, code_status_proses, ' + 
                        ' id_audit_dokumen, mulai_audit_dokumen, tenggat_audit_dokumen, selesai_audit_dokumen, mulai_perbaikan_audit_dokumen, '+
                        ' tenggat_perbaikan_audit_dokumen, selesai_perbaikan_audit_dokumen, keterangan_audit_dokumen, hasil_audit_dokumen, ' +
                        ' id_audit_lapang, mulai_audit_lapang, tenggat_audit_lapang, selesai_audit_lapang, mulai_perbaikan_audit_lapang, '+
                        ' tenggat_perbaikan_audit_lapang, selesai_perbaikan_audit_lapang, keterangan_audit_lapang, hasil_audit_lapang, ' +
                        ' id_sidang_komtek, mulai_sidang_komtek, tenggat_sidang_komtek, selesai_sidang_komtek, mulai_perbaikan_sidang_komtek, '+
                        ' tenggat_perbaikan_sidang_komtek, selesai_perbaikan_sidang_komtek, keterangan_sidang_komtek, hasil_sidang_komtek, ' +
                        ' id_tim_audit, tim_auditor, lead_auditor, tanggal_penugasan_tim_audit, surat_tugas_tim_audit, '+
                        ' id_tim_komtek, tim_komtek, lead_komtek, tanggal_penugasan_tim_komtek, surat_tugas_tim_komtek, '+
                        ' nama_perusahaan, alamat_perusahaan FROM' + db_history_pengajuan + 
                        ` WHERE $1=ANY(${role_query})  ORDER BY created DESC`, [user])
                }else{
                    let query_code = await pool.query('SELECT * FROM ' + db_proses_audit + ' WHERE code=$1', [code_proses]);
                    code = query_code.rows[0].status
                    if(code_proses == '20' || code_proses == '21'){
                        history = await pool.query(
                            ' SELECT id_pengajuan, id_pengguna, jenis_permohonan, created, nomor_sppb_psat_baru, status_proses, code_status_proses, ' + 
                            ' id_audit_dokumen, mulai_audit_dokumen, tenggat_audit_dokumen, selesai_audit_dokumen, mulai_perbaikan_audit_dokumen, '+
                            ' tenggat_perbaikan_audit_dokumen, selesai_perbaikan_audit_dokumen, keterangan_audit_dokumen, hasil_audit_dokumen, ' +
                            ' id_tim_audit, tim_auditor, lead_auditor, tanggal_penugasan_tim_audit, surat_tugas_tim_audit, '+
                            ' id_tim_komtek, tim_komtek, lead_komtek, tanggal_penugasan_tim_komtek, surat_tugas_tim_komtek, '+
                            ' nama_perusahaan, alamat_perusahaan FROM' + db_history_pengajuan + 
                            ` WHERE $1=ANY(${role_query}) AND code_status_proses=$2  ORDER BY created DESC`, [user, code_proses])   
                    }else if (code_proses == '30' || code_proses == '31'){
                        history = await pool.query(
                            ' SELECT id_pengajuan, id_pengguna, jenis_permohonan, created, nomor_sppb_psat_baru, status_proses, code_status_proses, ' + 
                            ' id_audit_lapang, mulai_audit_lapang, tenggat_audit_lapang, selesai_audit_lapang, mulai_perbaikan_audit_lapang, '+
                            ' tenggat_perbaikan_audit_lapang, selesai_perbaikan_audit_lapang, keterangan_audit_lapang, hasil_audit_lapang, ' +
                            ' id_tim_audit, tim_auditor, lead_auditor, tanggal_penugasan_tim_audit, surat_tugas_tim_audit, '+
                            ' id_tim_komtek, tim_komtek, lead_komtek, tanggal_penugasan_tim_komtek, surat_tugas_tim_komtek, '+
                            ' nama_perusahaan, alamat_perusahaan FROM' + db_history_pengajuan + 
                            ` WHERE $1=ANY(${role_query}) AND code_status_proses=$2  ORDER BY created DESC`, [user, code_proses])
                    }else if (code_proses == '40' || code_proses == '41'){
                        history = await pool.query(
                            ' SELECT id_pengajuan, id_pengguna, jenis_permohonan, created, nomor_sppb_psat_baru, status_proses, code_status_proses, ' + 
                            ' id_sidang_komtek, mulai_sidang_komtek, tenggat_sidang_komtek, selesai_sidang_komtek, mulai_perbaikan_sidang_komtek, '+
                            ' tenggat_perbaikan_sidang_komtek, selesai_perbaikan_sidang_komtek, keterangan_sidang_komtek, hasil_sidang_komtek, ' +
                            ' id_tim_audit, tim_auditor, lead_auditor, tanggal_penugasan_tim_audit, surat_tugas_tim_audit, '+
                            ' id_tim_komtek, tim_komtek, lead_komtek, tanggal_penugasan_tim_komtek, surat_tugas_tim_komtek, '+
                            ' nama_perusahaan, alamat_perusahaan FROM' + db_history_pengajuan + 
                            ` WHERE $1=ANY(${role_query}) AND code_status_proses=$2  ORDER BY created DESC`, [user, code_proses])
                    }else{
                        history = await pool.query(
                            ' SELECT id_pengajuan, id_pengguna, jenis_permohonan, created, nomor_sppb_psat_baru, status_proses, code_status_proses, ' + 
                            ' nama_perusahaan, alamat_perusahaan FROM' + db_history_pengajuan + 
                            ` WHERE $1=ANY(${role_query}) AND code_status_proses=$2 ORDER BY created DESC`, [user, code_proses])
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