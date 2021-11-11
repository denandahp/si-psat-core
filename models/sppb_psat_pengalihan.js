const debug = require('debug')('app:model:sppb_psat');
const pool = require('../libs/db');

const schema = '"sppb_psat"';
const db_pengajuan = schema + '.' + '"pengajuan"';
const db_file_permohonan = schema + '.' + '"file_permohonan"';
const db_info_produk = schema + '.' + '"info_produk"';
const db_sertifikat = schema + '.' + '"sertifikat_psat"';
const db_unit_produksi = schema + '.' + '"unit_produksi"';

var date = new Date(Date.now());date.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });

class SppbPsatModel {
    async permohonan_awal(data) {
        try {
            let response = {}
            let arr_unit_produksi = [];
            let arr_info_produk = [];
            for(let i =0; i<Object.keys(data.unit_produksi).length;i++){
                let value = data.unit_produksi
                let data_unit_produksi = [
                    data.id_pengguna, value[i].nama_unit, value[i].alamat_unit, value[i].status_kepemilikan, 
                    value[i].durasi_sewa, value[i].masa_sewa_berakhir, value[i].file_bukti, date, date ]
                let unit_produksi = await pool.query(
                    'INSERT INTO ' + db_unit_produksi + 
                    '(id_pengguna, nama_unit, alamat_unit, status_kepemilikan, durasi_sewa, masa_sewa_berakhir, ' +
                    'file_bukti, created, update) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', data_unit_produksi);
                arr_unit_produksi.push(unit_produksi.rows[0].id)
            };
            for(let i =0; i<Object.keys(data.info_produk).length;i++){
                let value = data.info_produk
                let data_info_produk = [
                    data.id_pengguna, value[i].nama_komoditas, value[i].cara_penyimpanan, value[i].pengolahan_minimal,
                    value[i].pengemasan_ulang, date, date]
                let info_produk = await pool.query(
                    'INSERT INTO ' + db_info_produk + 
                    ' (id_pengguna, nama_komoditas, cara_penyimpanan, pengolahan_minimal, pengemasan_ulang, created, update)' +
                    ' VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', data_info_produk);
                    arr_info_produk.push(info_produk.rows[0].id)
            };                
            let data_file_pemohonan = [data.id_pengguna, data.denah_ruangan_psat, data.diagram_alir_psat,
                                       data.sop_psat, data.bukti_penerapan_sop ,data.surat_permohonan, date, date]
            let file_permohonan = await pool.query(
                'INSERT INTO ' + db_file_permohonan + 
                ' (id_pengguna, denah_ruangan_psat, diagram_alir_psat, sop_psat, bukti_penerapan_sop, surat_permohonan, created, update)' +
                ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', data_file_pemohonan);
            let data_pengajuan = [data.id_pengguna, 'PERMOHONAN', data.status_proses, data.status_aktif, arr_info_produk,
                            file_permohonan.rows[0].id, arr_unit_produksi, date, date];
            let pengajuan = await pool.query(
                'INSERT INTO ' + db_pengajuan + 
                ' (id_pengguna, jenis_permohonan, status_proses, status_aktif, produk, file_permohonan, unit_produksi, created, update)' +
                ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', data_pengajuan);
            response.pengajuan = pengajuan.rows;
            response.file_permohonan = file_permohonan.rows;
            response.info_produk = data.info_produk;
            response.unit_produksi = data.unit_produksi;
            debug('get %o', response);
            return { status: '200', permohonan: "Permohonan Awal SPPB PSAT", data: response };
        } catch (ex) {
            console.log(ex.message);
            return { status: '400', Error: "" + ex };
        };
    }

    async perpanjangan_masa_berlaku(data) {
        try {
            let response = {}
            let arr_unit_produksi = [];
            let arr_info_produk = [];
            for(let i =0; i<Object.keys(data.unit_produksi).length;i++){
                let value = data.unit_produksi
                let data_unit_produksi = [
                    data.id_pengguna, value[i].nama_unit, value[i].alamat_unit, value[i].status_kepemilikan, 
                    value[i].durasi_sewa, value[i].masa_sewa_berakhir, value[i].file_bukti, date, date ]
                let unit_produksi = await pool.query(
                    'INSERT INTO ' + db_unit_produksi + 
                    '(id_pengguna, nama_unit, alamat_unit, status_kepemilikan, durasi_sewa, masa_sewa_berakhir, ' +
                    'file_bukti, created, update) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', data_unit_produksi);
                arr_unit_produksi.push(unit_produksi.rows[0].id)
            };
            for(let i =0; i<Object.keys(data.info_produk).length;i++){
                let value = data.info_produk
                let data_info_produk = [
                    data.id_pengguna, value[i].nama_komoditas, value[i].cara_penyimpanan, value[i].pengolahan_minimal,
                    value[i].pengemasan_ulang, date, date]
                let info_produk = await pool.query(
                    'INSERT INTO ' + db_info_produk + 
                    ' (id_pengguna, nama_komoditas, cara_penyimpanan, pengolahan_minimal, pengemasan_ulang, created, update)' +
                    ' VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', data_info_produk);
                    arr_info_produk.push(info_produk.rows[0].id)
            };    
            let data_sertifikat = [data.id_pengguna, data.id_pengajuan, data.nomor_sppb_psat, 
                                   data.level, data.ruang_lingkup, data.masa_berlaku, 
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
                                  arr_info_produk, file_permohonan.rows[0].id, 
                                  sertifikat.rows[0].id, arr_unit_produksi, date, date];
            let pengajuan = await pool.query(
                'INSERT INTO ' + db_pengajuan + 
                ' (id_pengguna, jenis_permohonan, status_proses, status_aktif, produk, file_permohonan, sertifikat, unit_produksi, created, update)' +
                ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *', data_pengajuan);
            response.pengajuan = pengajuan.rows[0];
            response.file_permohonan = file_permohonan.rows[0];
            response.info_produk = data.info_produk;
            response.unit_produksi = data.unit_produksi;
            response.sertifikat = sertifikat.rows[0];
            debug('get %o', response);
            return { status: '200', permohonan: "Perpanjangan Masa Berlaku SPPB PSAT", data: response };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async penambahan_ruang_lingkup(data) {
        try {
            let response = {}
            let arr_unit_produksi = [];
            let arr_info_produk = [];
            for(let i =0; i<Object.keys(data.unit_produksi).length;i++){
                let value = data.unit_produksi
                let data_unit_produksi = [
                    data.id_pengguna, value[i].nama_unit, value[i].alamat_unit, value[i].status_kepemilikan, 
                    value[i].durasi_sewa, value[i].masa_sewa_berakhir, value[i].file_bukti, date, date ]
                let unit_produksi = await pool.query(
                    'INSERT INTO ' + db_unit_produksi + 
                    '(id_pengguna, nama_unit, alamat_unit, status_kepemilikan, durasi_sewa, masa_sewa_berakhir, ' +
                    'file_bukti, created, update) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', data_unit_produksi);
                arr_unit_produksi.push(unit_produksi.rows[0].id)
            };
            for(let i =0; i<Object.keys(data.info_produk).length;i++){
                let value = data.info_produk
                let data_info_produk = [
                    data.id_pengguna, value[i].nama_komoditas, value[i].cara_penyimpanan, value[i].pengolahan_minimal,
                    value[i].pengemasan_ulang, date, date]
                let info_produk = await pool.query(
                    'INSERT INTO ' + db_info_produk + 
                    ' (id_pengguna, nama_komoditas, cara_penyimpanan, pengolahan_minimal, pengemasan_ulang, created, update)' +
                    ' VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', data_info_produk);
                    arr_info_produk.push(info_produk.rows[0].id)
            };    
            let data_sertifikat = [data.id_pengguna, data.id_pengajuan, data.nomor_sppb_psat, 
                                   data.level, data.ruang_lingkup, data.masa_berlaku, 
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
            let data_pengajuan = [data.id_pengguna, 'PENAMBAHAN', data.status_proses, data.status_aktif, 
                                  arr_info_produk, file_permohonan.rows[0].id, 
                                  sertifikat.rows[0].id, arr_unit_produksi, date, date];
            let pengajuan = await pool.query(
                'INSERT INTO ' + db_pengajuan +
                ' (id_pengguna, jenis_permohonan, status_proses, status_aktif, produk, file_permohonan, sertifikat, unit_produksi, created, update)' +
                ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *', data_pengajuan);
            response.pengajuan = pengajuan.rows[0];
            response.file_permohonan = file_permohonan.rows[0];
            response.info_produk = data.info_produk;
            response.unit_produksi = data.unit_produksi;
            response.sertifikat = sertifikat.rows[0];
            debug('get %o', response);
            return { status: '200', permohonan: "Penambahan Ruang Lingkup SPPB PSAT", data: response };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async pengalihan_kepemilikan(data) {
        try {
            let response;
            var date = new Date(Date.now());date.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
            let value = [data.pet_id, data.pet_checkup_date, data.pet_note, data.pet_photo, d, d];
            response = await pool.query('INSERT INTO ' + dbPetcheckup + ' (pet_id, pet_checkup_date, pet_note, pet_photo, created_at, updated_at)' +
                ' VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', value);
            // debug('get %o', res);
            return res.rows[0];
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

}
module.exports = new SppbPsatModel();