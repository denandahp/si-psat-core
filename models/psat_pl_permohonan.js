const pool = require('../libs/db');
var format = require('pg-format');

const schemapet = '"izin_edar"';
const db_daftar_pemasok = schemapet + '.' + '"daftar_pemasok"';
const db_daftar_pelanggan = schemapet + '.' + '"daftar_pelanggan"';
const db_file_permohonan = schemapet + '.' + '"file_permohonan"';
const db_info_produk = schemapet + '.' + '"info_produk"';
const db_pengajuan = schemapet + '.' + '"pengajuan"';
const db_unit_produksi = schemapet + '.' + '"unit_produksi"';


var date = new Date(Date.now());date.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });


class PsatPlPermohonanModel {
    async permohonan_izin(data) {
        try {
            let response = {};
            let file_permohonan, pengajuan;

            //Create new file pemohonan
            let data_file_permohonan = [data.id_pengguna, data.surat_permohonan_izin_edar, date, date];
            file_permohonan = await pool.query(
                format('INSERT INTO ' + db_file_permohonan + 
                ' (id_pengguna, surat_permohonan_izin_edar, created, update) VALUES (%L) RETURNING *', data_file_permohonan)
            );

            //Create pengajuan
            let data_pengajuan = [data.id_pengguna, true, file_permohonan.rows[0].id, data.status_pengajuan, date, date ]
            pengajuan = await pool.query(
                format('INSERT INTO ' + db_pengajuan + 
                ` (id_pengguna, status_aktif, file_permohonan, status_pengajuan, created, update, produk) VALUES (%L, '{${data.info_produk}}') RETURNING *`, data_pengajuan)
            );

            response.pengajuan = pengajuan.rows[0];
            response.file_permohonan = file_permohonan.rows[0];

            // debug('get %o', response);
            return { status: '200', permohohan: "Permohonan izin edar PSAT PL/perpanjangan izin edar PSAT PL", data: response };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async add_unit_produksi(data) {
        try {
            let data_unit_produksi = [
                data.id_pengguna, data.nama_unit, data.alamat_unit, data.status_kepemilikan, 
                data.durasi_sewa, data.masa_sewa_berakhir, data.file_bukti, 
                data.surat_pernyataan_sppb_psat, data.sppb_psat_nomor, data.sppb_psat_level, 
                data.sppb_psat_masa_berlaku, data.sppb_psat_ruang_lingkup, data.sppb_psat_file, date, date ]
            let unit_produksi = await pool.query(
                format('INSERT INTO ' + db_unit_produksi + 
                ' (id_pengguna, nama_unit, alamat_unit, status_kepemilikan, durasi_sewa, masa_sewa_berakhir, ' +
                'file_bukti, surat_pernyataan_sppb_psat, sppb_psat_nomor, sppb_psat_level, sppb_psat_masa_berlaku, '+
                'sppb_psat_ruang_lingkup, sppb_psat_file, created, update) VALUES (%L) RETURNING *', data_unit_produksi
                )
            )
            // debug('get %o', res);
            return { status: '200', permohohan: "Add Unit Produksi", data: unit_produksi.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async add_daftar_pemasok(data) {
        try {
            let data_daftar_pemasok = [data.id_pengguna, data.nama, data.alamat, date, date ]
            let daftar_pemasok = await pool.query(format(
                'INSERT INTO ' + db_daftar_pemasok + 
                ' (id_pengguna, nama, alamat, created, update) VALUES (%L) RETURNING *', data_daftar_pemasok)
            );
            // debug('get %o', res);
            return { status: '200', permohohan: "Add Daftar Pemasok", data: daftar_pemasok.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async add_daftar_pelanggan(data) {
        try {
            let data_daftar_pelanggan = [data.id_pengguna, data.nama, data.alamat, date, date ]
            let daftar_pelanggan = await pool.query(
                format('INSERT INTO ' + db_daftar_pelanggan + 
                ' (id_pengguna, nama, alamat, created, update) VALUES (%L) RETURNING *', data_daftar_pelanggan)
            );
            // debug('get %o', res);
            return { status: '200', permohohan: "Add Daftar Pelanggan", data: daftar_pelanggan.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async add_info_produk(data) {
        try {
            let data_info_produk = [
                data.id_pengguna, data.jenis_psat, data.nama_latin, data.negara_asal, data.nama_dagang, data.jenis_kemasan, data.berat_bersih,
                data.komposisi, data.coa_nomor, data.coa_tanggal, data.desain_tabel_dan_kemasan, data.diagram_alir_psat_luar_negri, 
                data.kelas_mutu, data.jenis_klaim, data.laporan_hasil_uji_mutu_nomor, data.laporan_hasil_uji_mutu_tanggal,
                data.sertifikat_jaminan_keamanan_psat, data.nama_merek, date, date];
            let sql = format('INSERT INTO ' + db_info_produk + 
                ' (id_pengguna, jenis_psat, nama_latin, negara_asal, nama_dagang, jenis_kemasan, berat_bersih, komposisi, coa_nomor, coa_tanggal, '+
                'desain_tabel_dan_kemasan, diagram_alir_psat_luar_negri, kelas_mutu, jenis_klaim, laporan_hasil_uji_mutu_nomor, laporan_hasil_uji_mutu_tanggal, '+
                'sertifikat_jaminan_keamanan_psat, nama_merek, created, update, unit_produksi, daftar_pemasok, daftar_pelanggan) VALUES '+
                `(%L, '{${data.unit_produksi}}', '{${data.daftar_pemasok}}', '{${data.daftar_pelanggan}}') RETURNING *`, data_info_produk)
            let info_produk = await pool.query(sql);
            // debug('get %o', res);
            return { status: '200', permohohan: "Add Info Produk", data: info_produk.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async update_unit_produksi(data) {
        try {
            let data_unit_produksi = [
                data.nama_unit, data.alamat_unit, data.status_kepemilikan, data.durasi_sewa, data.masa_sewa_berakhir,
                data.file_bukti, data.surat_pernyataan_sppb_psat, data.sppb_psat_nomor, data.sppb_psat_level, 
                data.sppb_psat_masa_berlaku, data.sppb_psat_ruang_lingkup, data.sppb_psat_file, date ]
            let unit_produksi = await pool.query(
                format('UPDATE ' + db_unit_produksi + 
                ' SET (nama_unit, alamat_unit, status_kepemilikan, durasi_sewa, masa_sewa_berakhir, ' +
                'file_bukti, surat_pernyataan_sppb_psat, sppb_psat_nomor, sppb_psat_level, sppb_psat_masa_berlaku, '+
                'sppb_psat_ruang_lingkup, sppb_psat_file, update) = (%L) '+
                `WHERE id = ${data.id} AND id_pengguna = ${data.id_pengguna} RETURNING *`, data_unit_produksi)
            )
            // debug('get %o', res);
            return { status: '200', permohohan: "Update Unit Produksi", data: unit_produksi.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async update_daftar_pemasok(data) {
        try {
            let data_daftar_pemasok = [data.nama, data.alamat, date ]
            let daftar_pemasok = await pool.query(format(
                'UPDATE ' + db_daftar_pemasok + ' SET (nama, alamat, update) = (%L) '+
                `WHERE id = ${data.id} AND id_pengguna = ${data.id_pengguna} RETURNING *`, data_daftar_pemasok)
            );
            // debug('get %o', res);
            return { status: '200', permohohan: "Update Daftar Pemasok", data: daftar_pemasok.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async update_daftar_pelanggan(data) {
        try {
            let data_daftar_pelanggan = [data.nama, data.alamat, date ]
            let daftar_pelanggan = await pool.query(
                format('UPDATE ' + db_daftar_pelanggan + ' SET (nama, alamat, update) = (%L) '+
                `WHERE id = ${data.id} AND id_pengguna = ${data.id_pengguna} RETURNING *`, data_daftar_pelanggan)
            );
            // debug('get %o', res);
            return { status: '200', permohohan: "Update Daftar Pelanggan", data: daftar_pelanggan.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async update_info_produk(data) {
        try {
            let data_info_produk = [
                data.jenis_psat, data.nama_latin, data.negara_asal, data.nama_dagang, data.jenis_kemasan, data.berat_bersih,
                data.komposisi, data.coa_nomor, data.coa_tanggal, data.desain_tabel_dan_kemasan, data.diagram_alir_psat_luar_negri, 
                data.kelas_mutu, data.jenis_klaim, data.laporan_hasil_uji_mutu_nomor, data.laporan_hasil_uji_mutu_tanggal,
                data.sertifikat_jaminan_keamanan_psat, data.nama_merek, date];
            let sql = format('UPDATE ' + db_info_produk + 
                ' SET (jenis_psat, nama_latin, negara_asal, nama_dagang, jenis_kemasan, berat_bersih, komposisi, coa_nomor, coa_tanggal, '+
                'desain_tabel_dan_kemasan, diagram_alir_psat_luar_negri, kelas_mutu, jenis_klaim, laporan_hasil_uji_mutu_nomor, laporan_hasil_uji_mutu_tanggal, '+
                'sertifikat_jaminan_keamanan_psat, nama_merek, update, unit_produksi, daftar_pemasok, daftar_pelanggan) = '+
                `(%L, '{${data.unit_produksi}}', '{${data.daftar_pemasok}}', '{${data.daftar_pelanggan}}') `+
                `WHERE id = ${data.id} AND id_pengguna = ${data.id_pengguna}RETURNING *`, data_info_produk)
            let info_produk = await pool.query(sql);
            // debug('get %o', res);
            return { status: '200', permohohan: "Update Info Produk", data: info_produk.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async delete_unit_produksi(id) {
        try {
            let unit_produksi = await pool.query('DELETE FROM ' + db_unit_produksi + ` WHERE id = ${id} RETURNING *`)
            // debug('get %o', res);
            return { status: '200', permohohan: "Delete Unit Produksi", data: unit_produksi.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async delete_daftar_pemasok(id) {
        try {
            let daftar_pemasok = await pool.query('DELETE FROM ' + db_daftar_pemasok + ` WHERE id = ${id} RETURNING *`)
            // debug('get %o', res);
            return { status: '200', permohohan: "Delete Daftar Pemasok", data: daftar_pemasok.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async delete_daftar_pelanggan(id) {
        try {
            let daftar_pelanggan = await pool.query('DELETE FROM ' + db_daftar_pelanggan + ` WHERE id = ${id} RETURNING *`)
            // debug('get %o', res);
            return { status: '200', permohohan: "Delete Daftar Pelanggan", data: daftar_pelanggan.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async delete_info_produk(id) {
        try {
            let info_produk = await pool.query('DELETE FROM ' + db_info_produk + ` WHERE id = ${id} RETURNING *`)
            // debug('get %o', res);
            return { status: '200', permohohan: "Delete Info Produk", data: info_produk.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

}
module.exports = new PsatPlPermohonanModel();