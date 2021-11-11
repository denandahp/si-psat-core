const debug = require('debug')('app:model:sppb_psat');
const pool = require('../libs/db');

const schema = '"sppb_psat"';
const db_pengajuan = schema + '.' + '"pengajuan"';
const db_file_permohonan = schema + '.' + '"file_permohonan"';
const db_ruang_lingkup = schema + '.' + '"ruang_lingkup"';
const db_unit_produksi = schema + '.' + '"unit_produksi"';
const db_info_perusahaan = schema + '.' + '"info_perusahaan"';


var date = new Date(Date.now());date.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });

class SppbPsatPermohonanModel {
    async permohonan_awal(data) {
        try {
            let response = {}
            let data_info_perusahaan = [data.id_pengguna, data.nama_perusahaan, data.alamat_perusahaan, date, date]
            let info_perusahaan = await pool.query(
                'INSERT INTO ' + db_info_perusahaan + 
                ' (id_pengguna, nama_perusahaan, alamat_perusahaan, created, update)' +
                ' VALUES ($1, $2, $3, $4, $5) RETURNING *', data_info_perusahaan);
            let data_file_pemohonan = [data.id_pengguna, data.denah_ruangan_psat, data.diagram_alir_psat,
                                       data.sop_psat, data.bukti_penerapan_sop ,data.surat_permohonan, date, date]
            let file_permohonan = await pool.query(
                'INSERT INTO ' + db_file_permohonan + 
                ' (id_pengguna, denah_ruangan_psat, diagram_alir_psat, sop_psat, bukti_penerapan_sop, surat_permohonan, created, update)' +
                ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', data_file_pemohonan);
            let data_pengajuan = [data.id_pengguna, 'PERMOHONAN', data.status_proses, data.status_aktif, data.ruang_lingkup,
                            file_permohonan.rows[0].id, data.unit_produksi, date, date];
            let pengajuan = await pool.query(
                'INSERT INTO ' + db_pengajuan + 
                ' (id_pengguna, jenis_permohonan, status_proses, status_aktif, produk, file_permohonan, unit_produksi, created, update)' +
                ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', data_pengajuan);
            response.pengajuan = pengajuan.rows[0];
            response.file_permohonan = file_permohonan.rows[0];
            response.info_perusahaan = info_perusahaan.rows[0];
            debug('get %o', response);
            return { status: '200', permohonan: "Permohonan Awal SPPB PSAT", data: response };
        } catch (ex) {
            console.log(ex.message);
            return { status: '400', Error: "" + ex };
        };
    }

    async unit_produksi(data) {
        try {
            let data_unit_produksi = [
                data.id_pengguna, data.nama_unit, data.alamat_unit, data.status_kepemilikan, 
                data.durasi_sewa, data.masa_sewa_berakhir, data.file_bukti, date, date ]
            let unit_produksi = await pool.query(
                'INSERT INTO ' + db_unit_produksi + 
                '(id_pengguna, nama_unit, alamat_unit, status_kepemilikan, durasi_sewa, masa_sewa_berakhir, ' +
                'file_bukti, created, update) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', data_unit_produksi);

            debug('get %o', unit_produksi);
            return { status: '200', permohonan: "Tambah Unit Produksi", data: unit_produksi.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async ruang_lingkup(data) {
        try {
            let data_ruang_lingkup = [
                data.id_pengguna, data.nama_komoditas, data.cara_penyimpanan, data.pengolahan_minimal,
                data.pengemasan_ulang, date, date]
            let ruang_lingkup = await pool.query(
                'INSERT INTO ' + db_ruang_lingkup + 
                ' (id_pengguna, nama_komoditas, cara_penyimpanan, pengolahan_minimal, pengemasan_ulang, created, update)' +
                ' VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', data_ruang_lingkup);
            debug('get %o', ruang_lingkup);
            return { status: '200', permohonan: "Tambah Ruang Lingkup", data: ruang_lingkup.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async update_unit_produksi(data) {
        try {
            let data_unit_produksi = [
                data.id, data.id_pengguna, data.nama_unit, data.alamat_unit, data.status_kepemilikan, 
                data.durasi_sewa, data.masa_sewa_berakhir, data.file_bukti, date, date ]
            let unit_produksi = await pool.query(
                'UPDATE ' + db_unit_produksi + 
                ' SET (nama_unit, alamat_unit, status_kepemilikan, durasi_sewa, masa_sewa_berakhir, ' +
                'file_bukti, created, update) = ($3, $4, $5, $6, $7, $8, $9, $10) '+
                'WHERE id=$1 AND id_pengguna=$2 RETURNING *', data_unit_produksi);

            debug('get %o', unit_produksi);
            return { status: '200', permohonan: "Update Unit Produksi", data: unit_produksi.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async update_ruang_lingkup(data) {
        try {
            let data_ruang_lingkup = [
                data.id, data.id_pengguna, data.nama_komoditas, data.cara_penyimpanan, data.pengolahan_minimal,
                data.pengemasan_ulang, date, date]
            let ruang_lingkup = await pool.query(
                'UPDATE ' + db_ruang_lingkup + 
                ' SET (nama_komoditas, cara_penyimpanan, pengolahan_minimal, pengemasan_ulang, created, update)' +
                ' = ($3, $4, $5, $6, $7, $8) WHERE id=$1 AND id_pengguna=$2 RETURNING *', data_ruang_lingkup);
            debug('get %o', ruang_lingkup);
            return { status: '200', permohonan: "Update Ruang Lingkup", data: ruang_lingkup.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async delete_unit_produksi(id) {
        try {
            let unit_produksi = await pool.query('DELETE FROM ' + db_unit_produksi + ` WHERE id = ${id} RETURNING *`)
            debug('get %o', unit_produksi);
            return { status: '200', permohohan: "Delete Unit Produksi", data: unit_produksi.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async delete_ruang_lingkup(id) {
        try {
          let ruang_lingkup = await pool.query('DELETE FROM ' + db_ruang_lingkup + ` WHERE id = ${id} RETURNING *`)
            debug('get %o', ruang_lingkup);
            return { status: '200', permohohan: "Delete Ruang Lingkup", data: ruang_lingkup.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

}
module.exports = new SppbPsatPermohonanModel();