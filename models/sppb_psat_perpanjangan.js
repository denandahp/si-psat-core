const check_query = require('./param/utils.js');
const debug = require('debug')('app:model:sppb_psat');
const pool = require('../libs/db');

const schema = '"sppb_psat"';
const schema_audit = '"audit"';
const db_pengajuan = schema + '.' + '"pengajuan"';
const db_file_permohonan = schema + '.' + '"file_permohonan"';
const db_sertifikat = schema + '.' + '"sertifikat_psat"';
const db_info_perusahaan = schema + '.' + '"info_perusahaan"';
const db_history_pengajuan = schema + '.' + '"history_all_pengajuan"';
const db_proses_audit = schema_audit + '.' + '"proses_audit"';



var date = check_query.date_now();

class SppbPsatModel {
    async perpanjangan_masa_berlaku(data) {
        let pengajuan;
        try {
            await check_query.check_data(data, ['sertifikat_jaminan_keamanan_pangan'])
            let response = {}
            let data_info_perusahaan = [data.id_pengguna, data.nama_perusahaan, data.alamat_perusahaan, date, date]
            let info_perusahaan = await pool.query(
                'INSERT INTO ' + db_info_perusahaan +
                ' (id_pengguna, nama_perusahaan, alamat_perusahaan, created, update)' +
                ' VALUES ($1, $2, $3, $4, $5) RETURNING *', data_info_perusahaan);
            let data_sertifikat = [data.id_pengguna, data.nomor_sppb_psat,
                data.level, data.ruang_lingkup_sppb_psat, data.masa_berlaku,
                data.surat_pemeliharaan_psat, data.sertifikat_sppb_psat_sebelumnya, date, date
            ]
            let sertifikat = await pool.query(
                'INSERT INTO ' + db_sertifikat +
                ' (id_pengguna, nomor_sppb_psat, level, ruang_lingkup, masa_berlaku, surat_pemeliharaan_psat, sertifikat_sppb_psat_sebelumnya, created, update)' +
                ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', data_sertifikat);
            let data_file_pemohonan = [data.id_pengguna, data.denah_ruangan_psat, data.diagram_alir_psat,
                data.sop_psat, data.bukti_penerapan_sop, data.surat_permohonan,
                data.sertifikat_jaminan_keamanan_pangan, date, date
            ]
            let file_permohonan = await pool.query(
                'INSERT INTO ' + db_file_permohonan +
                ' (id_pengguna, denah_ruangan_psat, diagram_alir_psat, sop_psat, bukti_penerapan_sop, surat_permohonan, sertifikat_jaminan_keamanan_pangan, created, update)' +
                ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', data_file_pemohonan);
            let data_pengajuan = [data.id_pengguna, 'PERPANJANGAN', 10, data.status_aktif,
                data.ruang_lingkup, file_permohonan.rows[0].id,
                sertifikat.rows[0].id, data.unit_produksi, info_perusahaan.rows[0].id, date, date
            ];
            pengajuan = await pool.query(
                'INSERT INTO ' + db_pengajuan +
                ' (id_pengguna, jenis_permohonan, status_proses, status_aktif, produk, file_permohonan, sertifikat, unit_produksi, info_perusahaan, created, update)' +
                ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *', data_pengajuan);
            response.pengajuan = pengajuan.rows[0];
            response.file_permohonan = file_permohonan.rows[0];
            response.sertifikat = sertifikat.rows[0];
            response.info_perusahaan = info_perusahaan.rows[0];
            let notif = await check_query.send_notification(pengajuan.rows[0].id, 'SPPB_PSAT');
            debug('get %o', response);
            return { status: '200', keterangan: "Perpanjangan Masa Berlaku SPPB PSAT", notifikasi: notif, data: response };
        } catch (ex) {
            if (ex.code == '401') {
                return { status: '400', Error: ex.pesan };
            }
            let delete_pengajuan = await pool.query('DELETE FROM ' + db_pengajuan + ' WHERE id = $1 RETURNING *', [pengajuan.rows[0].id]);
            await pool.query('DELETE FROM ' + db_info_perusahaan + ' WHERE id = $1 RETURNING *', [delete_pengajuan.rows[0].info_perusahaan]);
            await pool.query('DELETE FROM ' + db_file_permohonan + ' WHERE id = $1 RETURNING *', [delete_pengajuan.rows[0].file_permohonan]);
            await pool.query('DELETE FROM ' + db_sertifikat + ' WHERE id = $1 RETURNING *', [delete_pengajuan.rows[0].sertifikat]);
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async update_perpanjangan_nomor_sppb_psat(data) {
        try {
            await check_query.check_data(data)
            let code_proses = await pool.query('SELECT code FROM ' + db_proses_audit + ' WHERE status=$1', ['Terbit Sertifikat']);
            let data_pengajuan = [data.id_pengajuan, data.id_pengguna, 'PERPANJANGAN', data.nomor_sppb_psat, code_proses.rows[0].code, date];
            let pengajuan = await pool.query(
                'UPDATE' + db_pengajuan +
                ' SET (nomor_sppb_psat, status_proses, update) = ($4, $5, $6) WHERE id=$1 AND id_pengguna=$2 AND jenis_permohonan=$3 ' +
                'RETURNING id, id_pengguna, jenis_permohonan, status_proses, nomor_sppb_psat', data_pengajuan);
            check_query.check_queryset(pengajuan);
            debug('get %o', pengajuan);
            return { status: '200', keterangan: `Update Nomor SPPB PSAT ${data.nomor_sppb_psat}`, data: pengajuan.rows[0] };
        } catch (ex) {
            if (ex.code == '401') {
                return { status: '400', Error: ex.pesan };
            }
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async update_perpanjangan_masa_berlaku(data) {
        try {
            let response = {}
            await check_query.check_data(data, ['sertifikat_jaminan_keamanan_pangan'])
            let data_info_perusahaan = [data.id_pengguna, data.id_info_perusahaan, data.nama_perusahaan, data.alamat_perusahaan, date]
            let info_perusahaan = await pool.query(
                'UPDATE ' + db_info_perusahaan +
                ' SET(nama_perusahaan, alamat_perusahaan, update)' +
                ' = ($3, $4, $5) WHERE id_pengguna=$1 AND id=$2 RETURNING *', data_info_perusahaan);
            let data_sertifikat = [data.id_pengguna, data.id_sertifikat, data.nomor_sppb_psat,
                data.level, data.ruang_lingkup_sppb_psat, data.masa_berlaku,
                data.surat_pemeliharaan_psat, data.sertifikat_sppb_psat_sebelumnya, date
            ]
            let sertifikat = await pool.query(
                'UPDATE ' + db_sertifikat +
                ' SET(nomor_sppb_psat, level, ruang_lingkup, masa_berlaku, surat_pemeliharaan_psat, sertifikat_sppb_psat_sebelumnya, update)' +
                ' = ($3, $4, $5, $6, $7, $8, $9) WHERE id_pengguna=$1 AND id=$2 RETURNING *', data_sertifikat);
            let data_file_pemohonan = [data.id_pengguna, data.id_file_permohonan, data.denah_ruangan_psat, data.diagram_alir_psat,
                data.sop_psat, data.bukti_penerapan_sop, data.surat_permohonan,
                data.sertifikat_jaminan_keamanan_pangan, date
            ]
            let file_permohonan = await pool.query(
                'UPDATE ' + db_file_permohonan +
                ' SET(denah_ruangan_psat, diagram_alir_psat, sop_psat, bukti_penerapan_sop, surat_permohonan, sertifikat_jaminan_keamanan_pangan, update)' +
                ' = ($3, $4, $5, $6, $7, $8, $9) WHERE id_pengguna=$1 AND id=$2 RETURNING *', data_file_pemohonan);
            let data_pengajuan = [data.id_pengguna, data.id_pengajuan, 'PERPANJANGAN', data.status_aktif,
                data.ruang_lingkup, file_permohonan.rows[0].id,
                sertifikat.rows[0].id, data.unit_produksi, info_perusahaan.rows[0].id, date
            ];
            let pengajuan = await pool.query(
                'UPDATE ' + db_pengajuan +
                ' SET(jenis_permohonan, status_aktif, produk, file_permohonan, sertifikat, unit_produksi, info_perusahaan, update)' +
                ' = ($3, $4, $5, $6, $7, $8, $9, $10) WHERE id_pengguna=$1 AND id=$2 RETURNING *', data_pengajuan);
            check_query.check_queryset(pengajuan);
            check_query.check_queryset(file_permohonan);
            check_query.check_queryset(sertifikat);
            check_query.check_queryset(info_perusahaan);
            response.pengajuan = pengajuan.rows[0];
            response.file_permohonan = file_permohonan.rows[0];
            response.sertifikat = sertifikat.rows[0];
            response.info_perusahaan = info_perusahaan.rows[0];
            debug('get %o', response);
            return { status: '200', keterangan: "Update Perpanjangan Masa Berlaku SPPB PSAT", data: response };
        } catch (ex) {
            if (ex.code == '401') {
                return { status: '400', Error: ex.pesan };
            }
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async get_perpanjangan_masa_berlaku(id, user) {
        try {
            let perpanjangan;
            if (id == 'all') {
                perpanjangan = await pool.query(
                    'SELECT id_pengajuan, id_pengguna, kode_pengajuan, final_sertifikat, nomor_sppb_psat_baru, nama_perusahaan, alamat_perusahaan, ' +
                    ' nomor_sppb_psat_sebelumnya, nomor_sppb_psat_sebelumnya, level, denah_ruangan_psat, ' +
                    ' code_status_proses, ruang_lingkup, masa_berlaku, surat_pemeliharaan_psat, diagram_alir_psat, ' +
                    ' jenis_permohonan, sop_psat, bukti_penerapan_sop, surat_permohonan, sertifikat_jaminan_keamanan_pangan, status_proses, status_aktif, ' +
                    ' hasil_audit_dokumen, hasil_audit_lapang, hasil_sidang_komtek, bahan_sidang_komtek, ' +
                    ' keterangan_audit, keterangan_audit_dokumen, keterangan_audit_lapang, keterangan_sidang_komtek, ' +
                    ' id_tim_audit, tim_auditor, lead_auditor, tanggal_penugasan_tim_audit, surat_tugas_tim_audit, ' +
                    ' id_tim_komtek, tim_komtek, lead_komtek, tanggal_penugasan_tim_komtek, surat_tugas_tim_komtek, ' +
                    'produk, unit_produksi, created, update, id_sertifikat, id_info_perusahaan, id_file_permohonan FROM' + db_history_pengajuan + ' WHERE jenis_permohonan=$1', ["PERPANJANGAN"])
            } else {
                perpanjangan = await pool.query(
                    'SELECT id_pengajuan, id_pengguna, kode_pengajuan, final_sertifikat, nomor_sppb_psat_baru, nama_perusahaan, alamat_perusahaan, ' +
                    ' nomor_sppb_psat_sebelumnya, nomor_sppb_psat_sebelumnya, level, denah_ruangan_psat, ' +
                    ' code_status_proses, ruang_lingkup, masa_berlaku, surat_pemeliharaan_psat, diagram_alir_psat, ' +
                    ' jenis_permohonan, sop_psat, bukti_penerapan_sop, surat_permohonan, sertifikat_jaminan_keamanan_pangan, status_proses, status_aktif, ' +
                    ' hasil_audit_dokumen, hasil_audit_lapang, hasil_sidang_komtek, bahan_sidang_komtek, ' +
                    ' keterangan_audit, keterangan_audit_dokumen, keterangan_audit_lapang, keterangan_sidang_komtek, ' +
                    ' id_tim_audit, tim_auditor, lead_auditor, tanggal_penugasan_tim_audit, surat_tugas_tim_audit, ' +
                    ' id_tim_komtek, tim_komtek, lead_komtek, tanggal_penugasan_tim_komtek, surat_tugas_tim_komtek, ' +
                    'produk, unit_produksi, created, update, id_sertifikat, id_info_perusahaan, id_file_permohonan FROM' + db_history_pengajuan +
                    ' WHERE jenis_permohonan=$1 AND id_pengajuan=$2 AND id_pengguna=$3', ["PERPANJANGAN", id, user])
            }
            check_query.check_queryset(perpanjangan);
            debug('get %o', perpanjangan);
            return { status: '200', keterangan: "Detail Perpanjangan Masa Berlaku SPPB PSAT", data: perpanjangan.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }
}
module.exports = new SppbPsatModel();