const check_query = require('./param/utils.js');
const pool = require('../libs/db');
var format = require('pg-format');

const schemapet = '"izin_edar"';
const db_file_permohonan = schemapet + '.' + '"file_permohonan"';
const db_info_produk = schemapet + '.' + '"info_produk"';
const db_pengajuan = schemapet + '.' + '"pengajuan"';
const db_unit_produksi = schemapet + '.' + '"unit_produksi"';
const db_history_pengajuan = schemapet + '.' + '"history_all_pengajuan"';


var date = new Date(Date.now());
date.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });


class PsatPlPerubahanModel {

    //Perubahan Data Izin Edar PSAT PL -------------------------------------------
    async perubahan_data(data) {
        try {
            let response = {};
            let file_permohonan, perubahan_data;

            //Create new file pemohonan
            let data_file_permohonan = [
                data.id_pengguna, data.surat_permohonan_izin_edar, data.sertifikat_izin_edar_sebelumnya,
                data.surat_pernyataan, date, date
            ];
            file_permohonan = await pool.query(
                format('INSERT INTO ' + db_file_permohonan +
                    ' (id_pengguna, surat_permohonan_izin_edar, sertifikat_izin_edar_sebelumnya, ' +
                    'surat_pernyataan, created, update) VALUES (%L) RETURNING *', data_file_permohonan)
            );

            //Create pengajuan
            let data_perubahan_data = [data.id_pengguna, true, file_permohonan.rows[0].id, data.status_pengajuan, 10, date, date]
            perubahan_data = await pool.query(
                format('INSERT INTO ' + db_pengajuan +
                    ` (id_pengguna, status_aktif, file_permohonan, status_pengajuan, status_proses, created, update, produk) VALUES (%L, '{${data.info_produk}}') RETURNING *`, data_perubahan_data)
            );

            response.perubahan_data = perubahan_data.rows[0];
            response.file_permohonan = file_permohonan.rows[0];

            // debug('get %o', response);
            return { status: '200', permohohan: "Perubahan Data Izin Edar PSAT PL", data: response };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async add_perubahan_unit_produksi(data) {
        try {
            let data_unit_produksi = [
                data.id_pengguna, data.nama_unit, data.alamat_unit, data.status_kepemilikan,
                data.durasi_sewa, data.masa_sewa_berakhir, data.file_bukti,
                data.surat_pernyataan_sppb_psat, data.sppb_psat_nomor, data.sppb_psat_level,
                data.sppb_psat_masa_berlaku, data.sppb_psat_ruang_lingkup, data.sppb_psat_file, date, date
            ]
            let unit_produksi = await pool.query(
                    format('INSERT INTO ' + db_unit_produksi +
                        ' (id_pengguna, nama_unit, alamat_unit, status_kepemilikan, durasi_sewa, masa_sewa_berakhir, ' +
                        'file_bukti, surat_pernyataan_sppb_psat, sppb_psat_nomor, sppb_psat_level, sppb_psat_masa_berlaku, ' +
                        'sppb_psat_ruang_lingkup, sppb_psat_file, created, update) VALUES (%L) RETURNING *', data_unit_produksi
                    )
                )
                // debug('get %o', res);
            return { status: '200', permohohan: "Add Perubahan Unit Produksi", data: unit_produksi.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async add_perubahan_info_produk(data) {
        try {
            let data_info_produk = [
                data.id_pengguna, data.jenis_psat, data.nama_latin, data.nama_dagang, data.nomor_sertifikat,
                data.expire_sertifikat, data.file_sertifikat, data.data_awal, data.data_baru,
                data.alasan_perubahan, data.kemasan_lama, data.kemasan_baru, date, date
            ];
            let sql = format('INSERT INTO ' + db_info_produk +
                ' (id_pengguna, jenis_psat, nama_latin, nama_dagang, nomor_sertifikat, expire_sertifikat, file_sertifikat, ' +
                'data_awal, data_baru, alasan_perubahan, kemasan_lama, kemasan_baru, created, update, unit_produksi) VALUES ' +
                `(%L, '{${data.unit_produksi}}') RETURNING *`, data_info_produk)
            let info_produk = await pool.query(sql);
            // debug('get %o', res);
            return { status: '200', permohohan: "Add Perubahan Info Produk", data: info_produk.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async update_perubahan_data(data) {
        try {
            let response = {};
            let file_permohonan, perubahan_data;

            //Create new file pemohonan
            let data_file_permohonan = [
                data.surat_permohonan_izin_edar, data.sertifikat_izin_edar_sebelumnya,
                data.surat_pernyataan, date
            ];
            file_permohonan = await pool.query(
                format('UPDATE ' + db_file_permohonan +
                    ' SET(surat_permohonan_izin_edar, sertifikat_izin_edar_sebelumnya, ' +
                    `surat_pernyataan, update) = (%L) WHERE id_pengguna=${data.id_pengguna} AND id=${data.id_file_permohonan} RETURNING *`, data_file_permohonan)
            );

            //Create pengajuan
            let data_perubahan_data = [true, file_permohonan.rows[0].id, data.status_pengajuan, 10, date]
            perubahan_data = await pool.query(
                format('UPDATE ' + db_pengajuan +
                    ` SET(status_aktif, file_permohonan, status_pengajuan, status_proses, update, produk) = (%L, '{${data.info_produk}}') `+
                    `WHERE id_pengguna=${data.id_pengguna} AND id=${data.id_pengajuan} RETURNING *`, data_perubahan_data)
            );
            check_query.check_queryset(perubahan_data);
            check_query.check_queryset(file_permohonan);
            response.perubahan_data = perubahan_data.rows[0];
            response.file_permohonan = file_permohonan.rows[0];

            // debug('get %o', response);
            return { status: '200', permohohan: "Update Perubahan Data Izin Edar PSAT PL", data: response };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async update_perubahan_unit_produksi(data) {
        try {
            let data_unit_produksi = [
                data.nama_unit, data.alamat_unit, data.status_kepemilikan, data.durasi_sewa, data.masa_sewa_berakhir,
                data.file_bukti, data.surat_pernyataan_sppb_psat, data.sppb_psat_nomor, data.sppb_psat_level,
                data.sppb_psat_masa_berlaku, data.sppb_psat_ruang_lingkup, data.sppb_psat_file, date, date
            ]
            let unit_produksi = await pool.query(
                    format('UPDATE ' + db_unit_produksi +
                        ' SET (nama_unit, alamat_unit, status_kepemilikan, durasi_sewa, masa_sewa_berakhir, ' +
                        'file_bukti, surat_pernyataan_sppb_psat, sppb_psat_nomor, sppb_psat_level, sppb_psat_masa_berlaku, ' +
                        'sppb_psat_ruang_lingkup, sppb_psat_file, created, update) = (%L) ' +
                        `WHERE id = ${data.id} AND id_pengguna = ${data.id_pengguna}RETURNING *`, data_unit_produksi)
                )
            check_query.check_queryset(unit_produksi);
            // debug('get %o', res);
            return { status: '200', permohohan: "Update Perubahan Unit Produksi", data: unit_produksi.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async update_perubahan_info_produk(data) {
        try {
            let data_info_produk = [
                data.jenis_psat, data.nama_latin, data.nama_dagang, data.nomor_sertifikat,
                data.expire_sertifikat, data.file_sertifikat, data.data_awal, data.data_baru,
                data.alasan_perubahan, data.kemasan_lama, data.kemasan_baru, date, date
            ];
            let sql = format('UPDATE ' + db_info_produk +
                ' SET (jenis_psat, nama_latin, nama_dagang, nomor_sertifikat, expire_sertifikat, file_sertifikat, ' +
                'data_awal, data_baru, alasan_perubahan, kemasan_lama, kemasan_baru, created, update, unit_produksi) = ' +
                `(%L, '{${data.unit_produksi}}') WHERE id = ${data.id} AND id_pengguna = ${data.id_pengguna} RETURNING *`, data_info_produk)
            let info_produk = await pool.query(sql);
            check_query.check_queryset(info_produk);
            // debug('get %o', res);
            return { status: '200', permohohan: "Update Perubahan Info Produk", data: info_produk.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async delete_perubahan_unit_produksi(id) {
        try {
            let unit_produksi = await pool.query('DELETE FROM ' + db_unit_produksi + ` WHERE id = ${id} RETURNING *`)
            check_query.check_queryset(unit_produksi);
            // debug('get %o', res);
            return { status: '200', permohohan: "Delete Perubahan Unit Produksi", data: unit_produksi.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async delete_perubahan_info_produk(id) {
        try {
            let info_produk = await pool.query('DELETE FROM ' + db_info_produk + ` WHERE id = ${id} RETURNING *`)
            check_query.check_queryset(info_produk);
            // debug('get %o', res);
            return { status: '200', permohohan: "Delete Perubahan Info Produk", data: info_produk.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async get_perubahan_data(id, user) {
        try {
            let permohonan;
            if(id == 'all'){
                permohonan = await pool.query(
                    'SELECT id_pengajuan, id_pengguna, code_status_proses, status_aktif, status_pengajuan, surat_permohonan_izin_edar, produk, created, update, ' + 
                    'sertifikat_izin_edar_sebelumnya, surat_pernyataan FROM ' + db_history_pengajuan + ' WHERE status_pengajuan=$1', ["PERUBAHAN"])
            } else {
                permohonan = await pool.query(
                    'SELECT id_pengajuan, id_pengguna, code_status_proses, status_aktif, status_pengajuan, surat_permohonan_izin_edar, produk, created, update, '+
                    'sertifikat_izin_edar_sebelumnya, surat_pernyataan FROM ' + db_history_pengajuan + ' WHERE status_pengajuan=$1 AND id_pengajuan=$2 AND id_pengguna=$3', ["PERUBAHAN", id, user])
            }
            check_query.check_queryset(permohonan);
            // debug('get %o', permohonan);
            return { status: '200', keterangan: "Detail Perubahan Data PSAT PL/Izin Edar PL", data: permohonan.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

}
module.exports = new PsatPlPerubahanModel();