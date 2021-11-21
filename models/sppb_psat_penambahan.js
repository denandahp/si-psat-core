const check_query = require('./param/utils.js');
const debug = require('debug')('app:model:sppb_psat');
const pool = require('../libs/db');

const schema = '"sppb_psat"';
const db_pengajuan = schema + '.' + '"pengajuan"';
const db_file_permohonan = schema + '.' + '"file_permohonan"';
const db_sertifikat = schema + '.' + '"sertifikat_psat"';
const db_info_perusahaan = schema + '.' + '"info_perusahaan"';
const db_history_pengajuan= schema + '.' + '"history_all_pengajuan"';


var date = new Date(Date.now());date.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });

class SppbPsatModel {
    async penambahan_ruang_lingkup(data) {
        try {
            let response = {};
            let data_info_perusahaan = [data.id_pengguna, data.nama_perusahaan, data.alamat_perusahaan, date, date]
            let info_perusahaan = await pool.query(
                'INSERT INTO ' + db_info_perusahaan + 
                ' (id_pengguna, nama_perusahaan, alamat_perusahaan, created, update)' +
                ' VALUES ($1, $2, $3, $4, $5) RETURNING *', data_info_perusahaan);
            let data_sertifikat = [data.id_pengguna, data.nomor_sppb_psat, 
                                   data.level, data.ruang_lingkup_sppb_psat, data.masa_berlaku, 
                                   data.surat_pemeliharaan_psat, date, date]
            let sertifikat = await pool.query(
                'INSERT INTO ' + db_sertifikat + 
                ' (id_pengguna, nomor_sppb_psat, level, ruang_lingkup, masa_berlaku, surat_pemeliharaan_psat, created, update)' +
                ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', data_sertifikat);
            let data_file_pemohonan = [data.id_pengguna, data.denah_ruangan_psat, data.diagram_alir_psat,
                                       data.sop_psat, data.bukti_penerapan_sop ,data.surat_permohonan, 
                                       data.sertifikat_jaminan_keamanan_pangan, date, date]
            let file_permohonan = await pool.query(
                'INSERT INTO ' + db_file_permohonan + 
                ' (id_pengguna, denah_ruangan_psat, diagram_alir_psat, sop_psat, bukti_penerapan_sop, surat_permohonan, sertifikat_jaminan_keamanan_pangan, created, update)' +
                ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', data_file_pemohonan);
            let data_pengajuan = [data.id_pengguna, 'PENAMBAHAN', data.status_proses, data.status_aktif, 
                                  data.ruang_lingkup, file_permohonan.rows[0].id, 
                                  sertifikat.rows[0].id, data.unit_produksi, info_perusahaan.rows[0].id, date, date];
            let pengajuan = await pool.query(
                'INSERT INTO ' + db_pengajuan +
                ' (id_pengguna, jenis_permohonan, status_proses, status_aktif, produk, file_permohonan, sertifikat, unit_produksi, info_perusahaan, created, update)' +
                ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *', data_pengajuan);
            response.pengajuan = pengajuan.rows[0];
            response.file_permohonan = file_permohonan.rows[0];
            response.sertifikat = sertifikat.rows[0];
            response.info_perusahaan = info_perusahaan.rows[0];
            debug('get %o', response);
            return { status: '200', keterangan:"Penambahan Ruang Lingkup SPPB PSAT", data: response };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async update_penambahan_ruang_lingkup(data) {
        try {
            let response = {};
            let data_info_perusahaan = [data.id_pengguna, data.id_info_perusahaan, data.nama_perusahaan, data.alamat_perusahaan, date]
            let info_perusahaan = await pool.query(
                'UPDATE ' + db_info_perusahaan + 
                ' SET(nama_perusahaan, alamat_perusahaan, update)' +
                ' = ($3, $4, $5) WHERE id_pengguna=$1 AND id=$2 RETURNING *', data_info_perusahaan);
            let data_sertifikat = [data.id_pengguna, data.id_sertifikat, data.nomor_sppb_psat, 
                                   data.level, data.ruang_lingkup_sppb_psat, data.masa_berlaku, 
                                   data.surat_pemeliharaan_psat, date]
            let sertifikat = await pool.query(
                'UPDATE ' + db_sertifikat + 
                ' SET(nomor_sppb_psat, level, ruang_lingkup, masa_berlaku, surat_pemeliharaan_psat, update)' +
                ' = ($3, $4, $5, $6, $7, $8) WHERE id_pengguna=$1 AND id=$2 RETURNING *', data_sertifikat);
            let data_file_pemohonan = [data.id_pengguna, data.id_file_permohonan, data.denah_ruangan_psat, data.diagram_alir_psat,
                                       data.sop_psat, data.bukti_penerapan_sop ,data.surat_permohonan, 
                                       data.sertifikat_jaminan_keamanan_pangan, date]
            let file_permohonan = await pool.query(
                'UPDATE ' + db_file_permohonan + 
                ' SET(denah_ruangan_psat, diagram_alir_psat, sop_psat, bukti_penerapan_sop, surat_permohonan, sertifikat_jaminan_keamanan_pangan, update)' +
                ' = ($3, $4, $5, $6, $7, $8, $9) WHERE id_pengguna=$1 AND id=$2 RETURNING *', data_file_pemohonan);
            let data_pengajuan = [data.id_pengguna, data.id_pengajuan, 'PENAMBAHAN', data.status_proses, data.status_aktif, 
                                  data.ruang_lingkup, file_permohonan.rows[0].id, 
                                  sertifikat.rows[0].id, data.unit_produksi, info_perusahaan.rows[0].id, date];
            let pengajuan = await pool.query(
                'UPDATE ' + db_pengajuan +
                ' SET(jenis_permohonan, status_proses, status_aktif, produk, file_permohonan, sertifikat, unit_produksi, info_perusahaan, update)' +
                ' = ($3, $4, $5, $6, $7, $8, $9, $10, $11) WHERE id_pengguna=$1 AND id=$2 RETURNING *', data_pengajuan);
            check_query.check_queryset(pengajuan);
            check_query.check_queryset(file_permohonan);
            check_query.check_queryset(sertifikat);
            check_query.check_queryset(info_perusahaan);
            response.pengajuan = pengajuan.rows[0];
            response.file_permohonan = file_permohonan.rows[0];
            response.sertifikat = sertifikat.rows[0];
            response.info_perusahaan = info_perusahaan.rows[0];
            debug('get %o', response);
            return { status: '200', keterangan:"Update Penambahan Ruang Lingkup SPPB PSAT", data: response };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async update_penambahan_nomor_sppb_psat(data) {
        try {
            let data_pengajuan = [data.id_pengajuan, data.id_pengguna, 'PENAMBAHAN', data.nomor_sppb_psat, date];
            let pengajuan = await pool.query(
                'UPDATE' + db_pengajuan + 
                ' SET (nomor_sppb_psat, update) = ($4, $5) WHERE id=$1 AND id_pengguna=$2 AND jenis_permohonan=$3 '+
                'RETURNING id, id_pengguna, jenis_permohonan, status_proses, nomor_sppb_psat', data_pengajuan);
            check_query.check_queryset(pengajuan);
            debug('get %o', pengajuan);
            return { status: '200', keterangan: `Update Penambahan Ruang Lingkup Nomor SPPB PSAT ${data.nomor_sppb_psat}`, data: pengajuan.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async get_penambahan_masa_berlaku(id, user) {
        try {
            let penambahan;
            if(id == 'all'){
                penambahan = await pool.query(
                    'SELECT id_pengajuan, id_pengguna, nomor_sppb_psat_baru, nama_perusahaan, alamat_perusahaan, nomor_sppb_psat_sebelumnya, level, denah_ruangan_psat, ' +
                    'ruang_lingkup, masa_berlaku, surat_pemeliharaan_psat, diagram_alir_psat, '+
                    'jenis_permohonan, sop_psat, bukti_penerapan_sop, surat_permohonan, sertifikat_jaminan_keamanan_pangan, status_proses, status_aktif, '+
                    'produk, unit_produksi, created, update FROM' + db_history_pengajuan + ' WHERE jenis_permohonan=$1', ["PENAMBAHAN"])
            } else {
                penambahan = await pool.query(
                    'SELECT id_pengajuan, id_pengguna,nomor_sppb_psat_baru, nama_perusahaan, alamat_perusahaan, nomor_sppb_psat_sebelumnya, level, denah_ruangan_psat, ' +
                    'ruang_lingkup, masa_berlaku, surat_pemeliharaan_psat, diagram_alir_psat, '+
                    'jenis_permohonan, sop_psat, bukti_penerapan_sop, surat_permohonan, sertifikat_jaminan_keamanan_pangan, status_proses, status_aktif, '+
                    'produk, unit_produksi, created, update FROM' + db_history_pengajuan + 
                    ' WHERE jenis_permohonan=$1 AND id_pengajuan=$2 AND id_pengguna=$3', ["PENAMBAHAN", id, user])
            }
            check_query.check_queryset(penambahan);
            debug('get %o', penambahan);
            return { status: '200', keterangan: "Detail Penambahan Masa Berlaku SPPB PSAT", data: penambahan.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }
}
module.exports = new SppbPsatModel();