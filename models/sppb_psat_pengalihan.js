const check_query = require('./param/utils.js');
const debug = require('debug')('app:model:sppb_psat');
var format = require('pg-format');
const pool = require('../libs/db');


const schema = '"sppb_psat"';
const schema_audit = '"audit"';
const db_pengalihan = schema + '.' + '"pengajuan"';
const db_info_perusahaan = schema + '.' + '"info_perusahaan"';
const db_unit_produksi = schema + '.' + '"unit_produksi"';
const db_history_pengajuan = schema + '.' + '"history_all_pengajuan"';
const db_file_permohonan = schema + '.' + '"file_permohonan"';
const db_proses_audit = schema_audit + '.' + '"proses_audit"';
const db_sertifikat = schema + '.' + '"sertifikat_psat"';

var date = check_query.date_now();

class SppbPsatModel {
    async pengalihan_kepemilikan(data) {
        let pengajuan;
        try {
            let response = {};
            await check_query.check_data(data)
            let data_file_permohonan = [data.id_pengguna, data.surat_permohonan_pengalihan, data.surat_pernyataan, date, date];
            let file_permohonan = await pool.query(
                'INSERT INTO ' + db_file_permohonan +
                ' (id_pengguna, surat_permohonan_pengalihan, surat_pernyataan, created, update)' +
                ' VALUES ($1, $2, $3, $4, $5) RETURNING *', data_file_permohonan);
            let data_pengajuan = [
                data.id_pengguna, 'PENGALIHAN', 1, data.status_aktif, file_permohonan.rows[0].id,
                data.info_perusahaan, data.unit_produksi, date, date];
            pengajuan = await pool.query(
                'INSERT INTO ' + db_pengalihan + 
                ' (id_pengguna, jenis_permohonan, status_proses, status_aktif, file_permohonan, info_perusahaan, ' +
                'unit_produksi, created, update) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', data_pengajuan);

            let create_sertifikat = await pool.query(
                'INSERT INTO ' + db_sertifikat +
                ' (id_pengguna, id_pengajuan)' +
                ' VALUES ($1, $2) RETURNING *', [data.id_pengguna, pengajuan.rows[0].id]);
            let verifikasi_pvtpp = await pool.query('CALL ' + proc_verif_pvtpp + ' ($1, $2)', [pengajuan.rows[0].id, 'REVIEW']);
            response.pengajuan = pengajuan.rows[0];
            response.file_permohonan = file_permohonan.rows[0];
            response.create_sertifikat = create_sertifikat.rows[0];
            response.verifikasi_pvtpp = verifikasi_pvtpp.rows[0];
            let notif = await check_query.send_notification(pengajuan.rows[0].id, 'SPPB_PSAT');
            debug('get %o',response);
            return { status: '200', keterangan:"Pengalihan Kepemilikan SPPB PSAT", notifikasi: notif, data: response };
        } catch (ex) {
            let response={};
            if (ex.code == '402') {
                return { status: '400', Error: ex.pesan };
            }else if(ex.code == '401'){
                response = { status: '400', Error: ex.pesan };
            }else{
                response = { status: '400', Error: '' + ex }
            }
            let delete_pengajuan = await pool.query('DELETE FROM ' + db_pengalihan + ' WHERE id = $1 RETURNING *', [pengajuan.rows[0].id]);
            await pool.query('DELETE FROM ' + db_info_perusahaan + ' WHERE id = $1 RETURNING *', [delete_pengajuan.rows[0].info_perusahaan]);
            await pool.query('DELETE FROM ' + db_file_permohonan + ' WHERE id = $1 RETURNING *', [delete_pengajuan.rows[0].file_permohonan]);
            console.log('Enek seng salah iki ' + ex);
            return response;
        };
    }

    async add_pengalihan_info_perusahaan(data) {
        try {
            await check_query.check_data(data)
            let data_info_perusahaan = [
                data.id_pengguna, data.nama_perusahaan, data.alamat_perusahaan, data.nama_pemilik_lama, data.alamat_pemilik_lama,
                data.nama_pemilik_baru, data.alamat_pemilik_baru, date, date
            ]
            let info_perusahaan = await pool.query(
                    format('INSERT INTO ' + db_info_perusahaan +
                        ' (id_pengguna, nama_perusahaan, alamat_perusahaan, nama_pemilik_lama, alamat_pemilik_lama, nama_pemilik_baru, alamat_pemilik_baru, ' +
                        `created, update) VALUES (%L) RETURNING *`, data_info_perusahaan))
                // debug('get %o', res);
            return { status: '200', keterangan: "Add Pengalihan Kepemilikan Info Perusahaan SPPB PSAT", data: info_perusahaan.rows[0] };
        } catch (ex) {
            if(ex.code == '401'){
                return { status: '400', Error: ex.pesan };
            }
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async update_nomor_sppb_psat(data) {
        try {
            await check_query.check_data(data)
            let code_proses = await pool.query('SELECT code FROM ' + db_proses_audit + ' WHERE status=$1', ['Terbit Sertifikat']);
            let data_pengajuan = [data.id_pengajuan, data.id_pengguna, 'PENGALIHAN', data.nomor_sppb_psat, code_proses.rows[0].code, date];
            let pengajuan = await pool.query(
                'UPDATE' + db_pengalihan +
                ' SET (nomor_sppb_psat, status_proses, update) = ($4, $5, $6) WHERE id=$1 AND id_pengguna=$2 AND jenis_permohonan=$3 ' +
                'RETURNING id, id_pengguna, jenis_permohonan, status_proses, nomor_sppb_psat', data_pengajuan);
            check_query.check_queryset(pengajuan);
            debug('get %o', pengajuan);
            return { status: '200', keterangan: `Update Nomor SPPB PSAT ${data.nomor_sppb_psat}`, data: pengajuan.rows[0] };
        } catch (ex) {
            if(ex.code == '401'){
                return { status: '400', Error: ex.pesan };
            }
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async update_pengalihan_kepemilikan(data) {
        try {
            let response = {};
            await check_query.check_data(data)
            let data_pengajuan = [
                data.id_pengguna, data.id_pengajuan, 'PENGALIHAN', data.status_aktif, data.info_perusahaan, data.unit_produksi, date
            ];
            let pengajuan = await pool.query(
                'UPDATE ' + db_pengalihan +
                ' SET (jenis_permohonan, status_aktif, info_perusahaan, unit_produksi, update) = ' +
                '($3, $4, $5, $6, $7) WHERE id_pengguna=$1 AND id=$2 RETURNING *', data_pengajuan);
            check_query.check_queryset(pengajuan);
            let data_file_permohonan = [
                data.id_pengguna, pengajuan.rows[0].file_permohonan, data.surat_permohonan_pengalihan,
                data.surat_pernyataan, date
            ];
            let file_permohonan = await pool.query(
                'UPDATE ' + db_file_permohonan +
                ' SET (surat_permohonan_pengalihan, surat_pernyataan, update)' +
                ' = ($3, $4, $5)  WHERE id_pengguna=$1 AND id=$2 RETURNING *', data_file_permohonan);
            check_query.check_queryset(file_permohonan);
            response.pengajuan = pengajuan.rows[0];
            response.file_permohonan = file_permohonan.rows[0];
            debug('get %o', response);
            return { status: '200', keterangan: "Update Pengalihan Kepemilikan SPPB PSAT", data: response };
        } catch (ex) {
            if(ex.code == '401'){
                return { status: '400', Error: ex.pesan };
            }
            console.log(ex.message);
            return { status: '400', Error: "" + ex };
        };
    }

    async update_pengalihan_info_perusahaan(data) {
        try {
            await check_query.check_data(data)
            let data_info_perusahaan = [
                data.nama_perusahaan, data.alamat_perusahaan, data.nama_pemilik_lama, data.alamat_pemilik_lama,
                data.nama_pemilik_baru, data.alamat_pemilik_baru, date
            ]
            let info_perusahaan = await pool.query(
                format('UPDATE ' + db_info_perusahaan +
                    ' SET (nama_perusahaan, alamat_perusahaan, nama_pemilik_lama, alamat_pemilik_lama, nama_pemilik_baru, alamat_pemilik_baru, ' +
                    `update) = (%L) WHERE id = ${data.id} AND id_pengguna = ${data.id_pengguna} RETURNING *`, data_info_perusahaan
                )
            )
            check_query.check_queryset(info_perusahaan);
            // debug('get %o', res);
            return { status: '200', keterangan: "Update Pengalihan Kepemilikan Info Perusahaan SPPB PSAT", data: info_perusahaan.rows[0] };
        } catch (ex) {
            if(ex.code == '401'){
                return { status: '400', Error: ex.pesan };
            }
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async get_pengalihan_kepemilikan(id, user) {
        try {
            let permohonan;
            if (id == 'all') {
                permohonan = await pool.query(
                    'SELECT id_pengajuan, id_pengguna, kode_pengajuan, final_sertifikat, jenis_permohonan,  nomor_sppb_psat_baru, status_proses, status_aktif, created, update,' +
                    ' code_status_proses, surat_permohonan_pengalihan, surat_pernyataan, unit_produksi,  id_info_perusahaan, nama_perusahaan, alamat_perusahaan,' +
                    ' status_kepemilikan, nama_pemilik_lama, alamat_pemilik_lama, nama_pemilik_baru, alamat_pemilik_baru, ' +
                    ' hasil_audit_dokumen, hasil_audit_lapang, hasil_sidang_komtek, bahan_sidang_komtek, ' +
                    ' keterangan_audit, keterangan_audit_dokumen, keterangan_audit_lapang, keterangan_sidang_komtek, '+
                    ' id_tim_audit, tim_auditor, lead_auditor, tanggal_penugasan_tim_audit, surat_tugas_tim_audit, ' +
                    ' id_tim_komtek, tim_komtek, lead_komtek, tanggal_penugasan_tim_komtek, surat_tugas_tim_komtek' +
                    ' FROM' + db_history_pengajuan + ' WHERE jenis_permohonan=$1', ["PENGALIHAN"])
            } else {
                permohonan = await pool.query(
                    'SELECT id_pengajuan, id_pengguna, kode_pengajuan, final_sertifikat, jenis_permohonan, nomor_sppb_psat_baru, status_proses, status_aktif, created, update,' +
                    ' code_status_proses, surat_permohonan_pengalihan, surat_pernyataan, unit_produksi, id_info_perusahaan, nama_perusahaan, alamat_perusahaan,' +
                    ' status_kepemilikan, nama_pemilik_lama, alamat_pemilik_lama, nama_pemilik_baru, alamat_pemilik_baru, ' +
                    ' hasil_audit_dokumen, hasil_audit_lapang, hasil_sidang_komtek, bahan_sidang_komtek, ' +
                    ' keterangan_audit, keterangan_audit_dokumen, keterangan_audit_lapang, keterangan_sidang_komtek, '+
                    ' id_tim_audit, tim_auditor, lead_auditor, tanggal_penugasan_tim_audit, surat_tugas_tim_audit, ' +
                    ' id_tim_komtek, tim_komtek, lead_komtek, tanggal_penugasan_tim_komtek, surat_tugas_tim_komtek' +
                    ' FROM' + db_history_pengajuan + ' WHERE jenis_permohonan=$1 AND id_pengajuan=$2 AND id_pengguna=$3', ["PENGALIHAN", id, user])
            }
            check_query.check_queryset(permohonan);
            debug('get %o', permohonan);
            return { status: '200', keterangan: "Pengalihan Kepemilikan Unit Produksi SPPB PSAT", data: permohonan.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    //-----------------------------------Tidak Dipakai-----------------------------

    async add_pengalihan_unit_produksi(data) {
        try {
            let data_unit_produksi = [
                data.id_pengguna, data.nama_unit_psat, data.alamat_unit_psat, data.sppb_psat_nomor, data.sppb_psat_level,
                data.sppb_psat_masa_berlaku, data.sppb_psat_status_berlaku, data.sppb_psat_ruang_lingkup, date, date
            ]
            let unit_produksi = await pool.query(
                    format('INSERT INTO ' + db_unit_produksi +
                        ' (id_pengguna, nama_unit, alamat_unit, nomor_sppb_psat, level, masa_berlaku, status_berlaku, ' +
                        'ruang_lingkup, created, update) VALUES (%L) RETURNING *', data_unit_produksi
                    )
                )
                // debug('get %o', res);
            return { status: '200', keterangan: "Add Pengalihan Kepemilikan Unit Produksi SPPB PSAT", data: unit_produksi.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async update_pengalihan_unit_produksi(data) {
        try {
            let data_unit_produksi = [
                data.nama_unit_psat, data.alamat_unit_psat, data.sppb_psat_nomor, data.sppb_psat_level,
                data.sppb_psat_masa_berlaku, data.sppb_psat_status_berlaku, data.sppb_psat_ruang_lingkup, date
            ]
            let unit_produksi = await pool.query(
                format('UPDATE ' + db_unit_produksi +
                    ' SET (nama_unit, alamat_unit, nomor_sppb_psat, level, masa_berlaku, status_berlaku, ' +
                    `ruang_lingkup, update) = (%L) WHERE id = ${data.id} AND id_pengguna = ${data.id_pengguna} RETURNING *`, data_unit_produksi
                )
            )
            check_query.check_queryset(unit_produksi);
            // debug('get %o', res);
            return { status: '200', keterangan: "Update Pengalihan Kepemilikan Unit Produksi SPPB PSAT", data: unit_produksi.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async delete_pengalihan_unit_produksi(id) {
        try {
            let unit_produksi = await pool.query('DELETE FROM ' + db_unit_produksi + ` WHERE id = ${id} RETURNING *`)
            check_query.check_queryset(unit_produksi);

            // debug('get %o', res);
            return { status: '200', keterangan: "Delete Pengalihan Kepemilikan Unit Produksi SPPB PSAT", data: unit_produksi.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async delete_pengalihan_info_perusahaan(id) {
        try {
            let info_perusahaan = await pool.query('DELETE FROM ' + db_info_perusahaan + ` WHERE id = ${id} RETURNING *`)
            check_query.check_queryset(info_perusahaan);
            // debug('get %o', res);
            return { status: '200', keterangan: "Delete Pengalihan Kepemilikan Info Perusahaan SPPB PSAT", data: info_perusahaan.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async get_pengalihan_unit_produksi(id) {
        try {
            let unit_produksi;
            if (id == 'all') {
                unit_produksi = await pool.query('SELECT * FROM ' + db_unit_produksi)
            } else {
                unit_produksi = await pool.query('SELECT * FROM ' + db_unit_produksi + ` WHERE id = ${id}`)
            }
            check_query.check_queryset(unit_produksi);
            debug('get %o', unit_produksi);
            return { status: '200', keterangan: "Detail Pengalihan Kepemilikan Unit Produksi SPPB PSAT", data: unit_produksi.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async get_pengalihan_info_perusahaan(id) {
        try {
            let info_perusahaan;
            if (id == 'all') {
                info_perusahaan = await pool.query('SELECT * FROM ' + db_info_perusahaan)
            } else {
                info_perusahaan = await pool.query('SELECT * FROM ' + db_info_perusahaan + ` WHERE id = ${id}`)
            }
            check_query.check_queryset(info_perusahaan);
            debug('get %o', info_perusahaan);
            return { status: '200', keterangan: "Detail Pengalihan Kepemilikan Info Perusahaan SPPB PSAT", data: info_perusahaan.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async get_list_pengalihan_unit_produksi(id) {
        try {
            let unit_produksi;
            if (id == 'all') {
                unit_produksi = await pool.query('SELECT * FROM ' + db_unit_produksi)
            } else {
                unit_produksi = await pool.query('SELECT * FROM ' + db_unit_produksi + ` WHERE id = ANY(ARRAY${id})`)
            }
            check_query.check_queryset(unit_produksi);
            debug('get %o', unit_produksi);
            return { status: '200', keterangan: "List Pengalihan Kepemilikan Unit Produksi SPPB PSAT", data: unit_produksi.rows };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

}
module.exports = new SppbPsatModel();