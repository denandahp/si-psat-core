const debug = require('debug')('app:model:sppb_psat');
const pool = require('../libs/db');
const check_query = require('./param/utils.js');

const schema = '"sppb_psat"';
const db_pengajuan = schema + '.' + '"pengajuan"';
const db_file_permohonan = schema + '.' + '"file_permohonan"';
const db_ruang_lingkup = schema + '.' + '"ruang_lingkup"';
const db_unit_produksi = schema + '.' + '"unit_produksi"';
const db_info_perusahaan = schema + '.' + '"info_perusahaan"';
const db_history_pengajuan= schema + '.' + '"history_all_pengajuan"';

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
                            file_permohonan.rows[0].id, data.unit_produksi,info_perusahaan.rows[0].id, date, date];
            let pengajuan = await pool.query(
                'INSERT INTO ' + db_pengajuan + 
                ' (id_pengguna, jenis_permohonan, status_proses, status_aktif, produk, file_permohonan, unit_produksi, info_perusahaan, created, update)' +
                ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *', data_pengajuan);
            response.pengajuan = pengajuan.rows[0];
            response.file_permohonan = file_permohonan.rows[0];
            response.info_perusahaan = info_perusahaan.rows[0];
            debug('get %o', response);
            return { status: '200', keterangan: "Permohonan Awal SPPB PSAT", data: response };
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
            return { status: '200', keterangan: "Tambah Unit Produksi", data: unit_produksi.rows[0] };
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
            return { status: '200', keterangan: "Tambah Ruang Lingkup", data: ruang_lingkup.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async update_permohonan_awal(data) {
        try {
            console.log(data)
            let response = {}
            let data_info_perusahaan = [data.id_pengguna, data.id_info_perusahaan, data.nama_perusahaan, data.alamat_perusahaan, date]
            let info_perusahaan = await pool.query(
                'UPDATE ' + db_info_perusahaan + 
                ' SET (nama_perusahaan, alamat_perusahaan, update)' +
                ' = ($3, $4, $5) WHERE id_pengguna=$1 AND id=$2 RETURNING *', data_info_perusahaan);
            let data_file_pemohonan = [data.id_pengguna, data.id_file_permohonan, data.denah_ruangan_psat, data.diagram_alir_psat,
                                       data.sop_psat, data.bukti_penerapan_sop ,data.surat_permohonan, date]
            let file_permohonan = await pool.query(
                'UPDATE ' + db_file_permohonan + 
                ' SET (denah_ruangan_psat, diagram_alir_psat, sop_psat, bukti_penerapan_sop, surat_permohonan, update)' +
                ' = ($3, $4, $5, $6, $7, $8) WHERE id_pengguna=$1 AND id=$2 RETURNING *', data_file_pemohonan);
            let data_pengajuan = [data.id_pengguna, data.id_pengajuan, 'PERMOHONAN', data.status_proses, data.status_aktif, data.ruang_lingkup,
                            file_permohonan.rows[0].id, data.unit_produksi,info_perusahaan.rows[0].id, date];
            let pengajuan = await pool.query(
                'UPDATE ' + db_pengajuan + 
                ' SET (jenis_permohonan, status_proses, status_aktif, produk, file_permohonan, unit_produksi, info_perusahaan, update)' +
                ' = ($3, $4, $5, $6, $7, $8, $9, $10) WHERE id_pengguna=$1 AND id=$2 RETURNING *', data_pengajuan);
            check_query.check_queryset(info_perusahaan);
            check_query.check_queryset(file_permohonan);
            check_query.check_queryset(pengajuan);
            response.pengajuan = pengajuan.rows[0];
            response.file_permohonan = file_permohonan.rows[0];
            response.info_perusahaan = info_perusahaan.rows[0];
            debug('get %o', response);
            return { status: '200', keterangan: "Update Permohonan Awal SPPB PSAT", data: response };
        } catch (ex) {
            console.log(ex.message);
            return { status: '400', Error: "" + ex };
        };
    }

    async update_nomor_sppb_psat(data) {
        try {
            let data_pengajuan = [data.id_pengajuan, data.id_pengguna, 'PERMOHONAN', data.nomor_sppb_psat, date];
            let pengajuan = await pool.query(
                'UPDATE' + db_pengajuan + 
                ' SET (nomor_sppb_psat, update) = ($4, $5) WHERE id=$1 AND id_pengguna=$2 AND jenis_permohonan=$3 '+
                'RETURNING id, id_pengguna, jenis_permohonan, status_proses, nomor_sppb_psat', data_pengajuan);
            check_query.check_queryset(pengajuan);
            debug('get %o', pengajuan);
            return { status: '200', keterangan: `Update Nomor SPPB PSAT ${data.nomor_sppb_psat}`, data: pengajuan.rows[0] };
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
            check_query.check_queryset(unit_produksi);
            debug('get %o', unit_produksi);
            return { status: '200', keterangan: "Update Unit Produksi", data: unit_produksi.rows[0] };
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
            check_query.check_queryset(ruang_lingkup);
            debug('get %o', ruang_lingkup);
            return { status: '200', keterangan: "Update Ruang Lingkup", data: ruang_lingkup.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async delete_unit_produksi(id) {
        try {
            let unit_produksi = await pool.query('DELETE FROM ' + db_unit_produksi + ` WHERE id = ${id} RETURNING *`)
            check_query.check_queryset(unit_produksi);
            debug('get %o', unit_produksi);
            return { status: '200', keterangan: "Delete Unit Produksi", data: unit_produksi.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async delete_ruang_lingkup(id) {
        try {
            let ruang_lingkup = await pool.query('DELETE FROM ' + db_ruang_lingkup + ` WHERE id = ${id} RETURNING *`)
            check_query.check_queryset(ruang_lingkup);
            debug('get %o', ruang_lingkup);
            return { status: '200', keterangan: "Delete Ruang Lingkup", data: ruang_lingkup.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async get_unit_produksi(id) {
        try {
            let unit_produksi;
            if(id == 'all'){
                unit_produksi = await pool.query('SELECT * FROM ' + db_unit_produksi)
            } else{
                unit_produksi = await pool.query('SELECT * FROM ' + db_unit_produksi + ` WHERE id = ${id}`)
            }
            check_query.check_queryset(unit_produksi);
            debug('get %o', unit_produksi);
            return { status: '200', keterangan: "Detail Unit Produksi", data: unit_produksi.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async get_ruang_lingkup(id) {
        try {
            let ruang_lingkup
            if(id == 'all'){
                ruang_lingkup = await pool.query('SELECT * FROM ' + db_ruang_lingkup)
            } else {
                ruang_lingkup = await pool.query('SELECT * FROM ' + db_ruang_lingkup + ` WHERE id = ${id}`)
            }
            check_query.check_queryset(ruang_lingkup);
            debug('get %o', ruang_lingkup);
            return { status: '200', keterangan: "Detail Ruang Lingkup", data: ruang_lingkup.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async get_permohonan_awal(id, user) {
        try {
            let permohonan;
            if(id == 'all'){
                permohonan = await pool.query(
                    'SELECT id_pengajuan, id_pengguna, nama_perusahaan, alamat_perusahaan, denah_ruangan_psat, diagram_alir_psat, '+
                    'jenis_permohonan, sop_psat, bukti_penerapan_sop, surat_permohonan, status_proses, status_aktif, produk, '+
                    ' unit_produksi, created, update, id_info_perusahaan, id_file_permohonan FROM' + db_history_pengajuan + ' WHERE jenis_permohonan=$1', ["PERMOHONAN"])
            } else {
                permohonan = await pool.query(
                    'SELECT id_pengajuan, id_pengguna, nama_perusahaan, alamat_perusahaan, denah_ruangan_psat, diagram_alir_psat, '+
                    'jenis_permohonan, sop_psat, bukti_penerapan_sop, surat_permohonan, status_proses, status_aktif, produk, '+
                    'unit_produksi, created, update, id_info_perusahaan, id_file_permohonan FROM' + db_history_pengajuan + 
                    ' WHERE jenis_permohonan=$1 AND id_pengajuan=$2 AND id_pengguna=$3', ["PERMOHONAN", id, user])
            }
            check_query.check_queryset(permohonan);
            debug('get %o', permohonan);
            return { status: '200', keterangan: "Detail Permohonan Awal SPPB PSAT", data: permohonan.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async get_history_pengajuan(user) {
        try {
            let history;
            if(user == 'all'){
                history = await pool.query(
                    'SELECT id_pengajuan, id_pengguna, jenis_permohonan, created, nomor_sppb_psat_baru, status_proses FROM' + db_history_pengajuan)
            } else {
                history = await pool.query(
                    'SELECT id_pengajuan, id_pengguna, jenis_permohonan, created, nomor_sppb_psat_baru, status_proses FROM' + 
                    db_history_pengajuan + ' WHERE id_pengguna=$1', [user])
            }
            check_query.check_queryset(history);
            debug('get %o', history);
            return { status: '200', keterangan: `History SPPB PSAT id ${user}` , data: history.rows };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async get_list_unit_produksi(id) {
        try {
            let unit_produksi;
            if(id == 'all'){
                unit_produksi = await pool.query('SELECT id, nama_unit, alamat_unit, status_kepemilikan, durasi_sewa FROM ' + db_unit_produksi)
            } else{
                unit_produksi = await pool.query('SELECT id, nama_unit, alamat_unit, status_kepemilikan, durasi_sewa FROM ' + db_unit_produksi + ` WHERE id = ANY(ARRAY${id})`)
            }
            check_query.check_queryset(unit_produksi);
            debug('get %o', unit_produksi);
            return { status: '200', keterangan: "List Unit Produksi", data: unit_produksi.rows };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async get_list_ruang_lingkup(id) {
        try {
            let ruang_lingkup
            if(id == 'all'){
                ruang_lingkup = await pool.query('SELECT id, nama_komoditas, cara_penyimpanan, pengemasan_ulang FROM ' + db_ruang_lingkup)
            } else {
                ruang_lingkup = await pool.query('SELECT id, nama_komoditas, cara_penyimpanan, pengemasan_ulang FROM ' + db_ruang_lingkup + ` WHERE id = ANY(ARRAY${id})`)
            }
            check_query.check_queryset(ruang_lingkup);
            debug('get %o', ruang_lingkup);
            return { status: '200', keterangan: "List Ruang Lingkup", data: ruang_lingkup.rows };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

}
module.exports = new SppbPsatPermohonanModel();
