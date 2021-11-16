const debug = require('debug')('app:model:sppb_psat');
var format = require('pg-format');
const pool = require('../libs/db');


const schema = '"pengalihan"';
const db_pengalihan = schema + '.' + '"pengalihan"';
const db_info_perusahaan = schema + '.' + '"info_perusahaan"';
const db_unit_produksi = schema + '.' + '"unit_produksi"';
const db_history_pengajuan= schema + '.' + '"history_all_pengajuan"';

var date = new Date(Date.now());date.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });

class SppbPsatModel {
    async pengalihan_kepemilikan(data) {
        try {
            let data_pengajuan = [
                data.id_pengguna, 'PENGALIHAN', data.status_proses, data.status_aktif, data.surat_permohonan_pengalihan,
                data.surat_pernyataan, data.info_perusahaan, data.unit_produksi, date, date];
            let pengajuan = await pool.query(
                'INSERT INTO ' + db_pengalihan + 
                ' (id_pengguna, jenis_permohonan, status_proses, status_aktif, surat_permohonan_pengalihan, surat_pernyataan, info_perusahaan, ' +
                'unit_produksi, created, update) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *', data_pengajuan);
            debug('get %o', pengajuan.rows[0]);
            return { status: '200', permohonan: "Pengalihan Kepemilikan SPPB PSAT", data: pengajuan.rows[0] };
        } catch (ex) {
            console.log(ex.message);
            return { status: '400', Error: "" + ex };
        };
    }

    async add_pengalihan_unit_produksi(data) {
        try {
            let data_unit_produksi = [
                data.id_pengguna, data.nama_unit_psat, data.alamat_unit_psat, data.sppb_psat_nomor, data.sppb_psat_level,
                data.sppb_psat_masa_berlaku, data.sppb_psat_status_berlaku, data.sppb_psat_ruang_lingkup, date, date ]
            let unit_produksi = await pool.query(
                format('INSERT INTO ' + db_unit_produksi + 
                ' (id_pengguna, nama_unit_psat, alamat_unit_psat, nomor_sppb_psat, level, masa_berlaku, status_berlaku, '+
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

    async add_pengalihan_info_perusahaan(data) {
        try {
            let data_info_perusahaan = [
                data.id_pengguna, data.nama_perusahaan, data.alamat_perusahaan, data.nama_pemilik_lama, data.alamat_pemilik_lama,
                data.nama_pemilik_baru, data.alamat_pemilik_baru, date, date ]
            let info_perusahaan = await pool.query(
                format('INSERT INTO ' + db_info_perusahaan + 
                ' (id_pengguna, nama_perusahaan, alamat_perusahaan, nama_pemilik_lama, alamat_pemilik_lama, nama_pemilik_baru, alamat_pemilik_baru, '+
                `created, update, unit_produksi) VALUES (%L, '{${data.unit_produksi}}') RETURNING *`, data_info_perusahaan
                )
            )
            // debug('get %o', res);
            return { status: '200', keterangan: "Add Pengalihan Kepemilikan Info Perusahaan SPPB PSAT", data: info_perusahaan.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async update_pengalihan_unit_produksi(data) {
        try {
            let data_unit_produksi = [
                data.nama_unit_psat, data.alamat_unit_psat, data.sppb_psat_nomor, data.sppb_psat_level,
                data.sppb_psat_masa_berlaku, data.sppb_psat_status_berlaku, data.sppb_psat_ruang_lingkup, date, date ]
            let unit_produksi = await pool.query(
                format('UPDATE ' + db_unit_produksi + 
                ' SET (nama_unit_psat, alamat_unit_psat, nomor_sppb_psat, level, masa_berlaku, status_berlaku, '+
                `ruang_lingkup, created, update) = (%L) WHERE id = ${data.id} AND id_pengguna = ${data.id_pengguna} RETURNING *`, data_unit_produksi
                )
            )
            // debug('get %o', res);
            return { status: '200', keterangan: "Update Pengalihan Kepemilikan Unit Produksi SPPB PSAT", data: unit_produksi.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async update_pengalihan_info_perusahaan(data) {
        try {
            let data_info_perusahaan = [
                data.nama_perusahaan, data.alamat_perusahaan, data.nama_pemilik_lama, data.alamat_pemilik_lama,
                data.nama_pemilik_baru, data.alamat_pemilik_baru, date, date ]
            let info_perusahaan = await pool.query(
                format('UPDATE ' + db_info_perusahaan + 
                ' SET (nama_perusahaan, alamat_perusahaan, nama_pemilik_lama, alamat_pemilik_lama, nama_pemilik_baru, alamat_pemilik_baru, '+
                `created, update, unit_produksi) = (%L, '{${data.unit_produksi}}') `+
                `WHERE id = ${data.id} AND id_pengguna = ${data.id_pengguna} RETURNING *`, data_info_perusahaan
                )
            )
            // debug('get %o', res);
            return { status: '200', keterangan: "Update Pengalihan Kepemilikan Info Perusahaan SPPB PSAT", data: info_perusahaan.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async delete_pengalihan_unit_produksi(id) {
        try {
            let unit_produksi = await pool.query('DELETE FROM ' + db_unit_produksi + ` WHERE id = ${id} RETURNING *`)

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

            // debug('get %o', res);
            return { status: '200', keterangan: "Delete Pengalihan Kepemilikan Info Perusahaan SPPB PSAT", data: info_perusahaan.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async get_pengalihan_kepemilikan(id, user) {
        try {
            let permohonan;
            if(id == 'all'){
                if (user){
                    permohonan = await pool.query(
                        'SELECT * FROM' + db_history_pengajuan + 
                        ' WHERE jenis_permohonan=$1 AND id_pengguna=$2', ["PENGALIHAN", user])
                } else{
                    permohonan = await pool.query(
                        'SELECT * FROM' + db_history_pengajuan + ' WHERE jenis_permohonan=$1', ["PENGALIHAN"])
                }
            } else {
                permohonan = await pool.query(
                    'SELECT * FROM' + db_history_pengajuan + 
                    ' WHERE jenis_permohonan=$1 AND id_pengajuan=$2 AND id_pengguna=$3', ["PENGALIHAN", id, user])
            }
            debug('get %o', permohonan);
            return { status: '200', keterangan: "Pengalihan Kepemilikan Unit Produksi SPPB PSAT", data: permohonan.rows };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async get_pengalihan_unit_produksi(id) {
        try {
            let unit_produksi;
            if(id == 'all'){
                unit_produksi = await pool.query('SELECT * FROM ' + db_unit_produksi)
            } else{
                unit_produksi = await pool.query('SELECT * FROM ' + db_unit_produksi + ` WHERE id = ${id}`)
            }
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
            if(id == 'all'){
                info_perusahaan = await pool.query('SELECT * FROM ' + db_info_perusahaan)
            } else{
                info_perusahaan = await pool.query('SELECT * FROM ' + db_info_perusahaan + ` WHERE id = ${id}`)
            }
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
            if(id == 'all'){
                unit_produksi = await pool.query('SELECT nama_unit_psat, alamat_unit_psat, nomor_sppb_psat FROM ' + db_unit_produksi)
            } else{
                unit_produksi = await pool.query('SELECT nama_unit_psat, alamat_unit_psat, nomor_sppb_psat FROM ' + db_unit_produksi + ` WHERE id = ANY(ARRAY${id})`)
            }
            debug('get %o', unit_produksi);
            return { status: '200', keterangan: "List Pengalihan Kepemilikan Unit Produksi SPPB PSAT", data: unit_produksi.rows };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

}
module.exports = new SppbPsatModel();