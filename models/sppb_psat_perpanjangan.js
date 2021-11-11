const debug = require('debug')('app:model:sppb_psat');
const pool = require('../libs/db');

const schema = '"sppb_psat"';
const db_pengajuan = schema + '.' + '"pengajuan"';
const db_file_permohonan = schema + '.' + '"file_permohonan"';
const db_sertifikat = schema + '.' + '"sertifikat_psat"';
const db_info_perusahaan = schema + '.' + '"info_perusahaan"';

var date = new Date(Date.now());date.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });

class SppbPsatModel {
    async perpanjangan_masa_berlaku(data) {
        try {
            let response = {}
            let data_info_perusahaan = [data.id_pengguna, data.nama_perusahaan, data.alamat_perusahaan, date, date]
            let info_perusahaan = await pool.query(
                'INSERT INTO ' + db_info_perusahaan + 
                ' (id_pengguna, nama_perusahaan, alamat_perusahaan, created, update)' +
                ' VALUES ($1, $2, $3, $4, $5) RETURNING *', data_info_perusahaan);
            let data_sertifikat = [data.id_pengguna, data.id_pengajuan, data.nomor_sppb_psat, 
                                   data.level, data.ruang_lingkup_sppb_psat, data.masa_berlaku, 
                                   data.surat_pemeliharaan_psat, date, date]
            let sertifikat = await pool.query(
                'INSERT INTO ' + db_sertifikat + 
                ' (id_pengguna, id_pengajuan, nomor_sppb_psat, level, ruang_lingkup, masa_berlaku, surat_pemeliharaan_psat, created, update)' +
                ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', data_sertifikat);
            let data_file_pemohonan = [data.id_pengguna, data.denah_ruangan_psat, data.diagram_alir_psat,
                                       data.sop_psat, data.bukti_penerapan_sop ,data.surat_permohonan, 
                                       data.sertifikat_jaminan_keamanan_pangan, date, date]
            let file_permohonan = await pool.query(
                'INSERT INTO ' + db_file_permohonan + 
                ' (id_pengguna, denah_ruangan_psat, diagram_alir_psat, sop_psat, bukti_penerapan_sop, surat_permohonan, sertifikat_jaminan_keamanan_pangan, created, update)' +
                ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', data_file_pemohonan);
            let data_pengajuan = [data.id_pengguna, 'PERPANJANGAN', data.status_proses, data.status_aktif, 
                                  data.ruang_lingkup, file_permohonan.rows[0].id, 
                                  sertifikat.rows[0].id, data.unit_produksi, date, date];
            let pengajuan = await pool.query(
                'INSERT INTO ' + db_pengajuan + 
                ' (id_pengguna, jenis_permohonan, status_proses, status_aktif, produk, file_permohonan, sertifikat, unit_produksi, created, update)' +
                ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *', data_pengajuan);
            response.pengajuan = pengajuan.rows[0];
            response.file_permohonan = file_permohonan.rows[0];
            response.sertifikat = sertifikat.rows[0];
            response.info_perusahaan = info_perusahaan.rows[0];
            debug('get %o', response);
            return { status: '200', permohonan: "Perpanjangan Masa Berlaku SPPB PSAT", data: response };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

}
module.exports = new SppbPsatModel();