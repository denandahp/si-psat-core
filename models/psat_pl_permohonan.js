const check_query = require('./param/utils.js');
const pool = require('../libs/db');
var format = require('pg-format');

const schemapet = '"izin_edar"';
const schema_audit = '"audit"';
const db_daftar_pemasok = schemapet + '.' + '"daftar_pemasok"';
const db_daftar_pelanggan = schemapet + '.' + '"daftar_pelanggan"';
const db_file_permohonan = schemapet + '.' + '"file_permohonan"';
const db_info_produk = schemapet + '.' + '"info_produk"';
const db_pengajuan = schemapet + '.' + '"pengajuan"';
const db_unit_produksi = schemapet + '.' + '"unit_produksi"';
const db_history_pengajuan = schemapet + '.' + '"history_all_pengajuan"';
const db_proses_audit = schema_audit + '.' + '"proses_audit"';

var date = check_query.date_now();

class PsatPlPermohonanModel {
    async permohonan_izin(data) {
        let file_permohonan, pengajuan;
        try {
            let response = {};
            await check_query.check_data(data)
                //Create new file pemohonan
            let data_file_permohonan = [data.id_pengguna, data.surat_permohonan_izin_edar, date, date];
            file_permohonan = await pool.query(
                format('INSERT INTO ' + db_file_permohonan +
                    ' (id_pengguna, surat_permohonan_izin_edar, created, update) VALUES (%L) RETURNING *', data_file_permohonan)
            );

            //Create pengajuan
            let data_pengajuan = [data.id_pengguna, true, file_permohonan.rows[0].id, 
                                  data.status_pengajuan, 10, data.id_izin_oss, 
                                  data.nama_perseroan, data.alamat_perseroan, date, date]
            pengajuan = await pool.query(
                format('INSERT INTO ' + db_pengajuan +
                    ` (id_pengguna, status_aktif, file_permohonan, status_pengajuan, status_proses, id_izin_oss, `+
                    ` nama_perusahaan, alamat_perusahaan, created, update, produk) VALUES (%L, '{${data.info_produk}}') RETURNING *`, data_pengajuan)
            );

            response.pengajuan = pengajuan.rows[0];
            response.file_permohonan = file_permohonan.rows[0];
            let notif = await check_query.send_notification(pengajuan.rows[0].id, 'IZIN_EDAR');

            // debug('get %o', response);
            return { status: '200', permohohan: "Permohonan izin edar PSAT PL/perpanjangan izin edar PSAT PL", notifikasi: notif, data: response };
        } catch (ex) {
            if (ex.code == '401') {
                return { status: '400', Error: ex.pesan };
            }
            let delete_pengajuan = await pool.query('DELETE FROM ' + db_pengajuan + ' WHERE id = $1 RETURNING *', [pengajuan.rows[0].id]);
            await pool.query('DELETE FROM ' + db_file_permohonan + ' WHERE id = $1 RETURNING *', [delete_pengajuan.rows[0].file_permohonan]);
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async add_unit_produksi(data) {
        try {
            let data_unit_produksi = [
                data.id_pengguna, data.nama_unit, data.alamat_unit, data.status_kepemilikan,
                data.durasi_sewa, data.masa_sewa_berakhir, data.file_bukti, data.bukti_sewa,
                data.surat_pernyataan_sppb_psat, data.sppb_psat_nomor, data.sppb_psat_level,
                data.sppb_psat_masa_berlaku, data.sppb_psat_ruang_lingkup, data.sppb_psat_file, date, date
            ]
            let unit_produksi = await pool.query(
                    format('INSERT INTO ' + db_unit_produksi +
                        ' (id_pengguna, nama_unit, alamat_unit, status_kepemilikan, durasi_sewa, masa_sewa_berakhir, ' +
                        'file_bukti, bukti_sewa, surat_pernyataan_sppb_psat, sppb_psat_nomor, sppb_psat_level, sppb_psat_masa_berlaku, ' +
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
            await check_query.check_data(data)
            let data_daftar_pemasok = [data.id_pengguna, data.nama, data.alamat, date, date]
            let daftar_pemasok = await pool.query(format(
                'INSERT INTO ' + db_daftar_pemasok +
                ' (id_pengguna, nama, alamat, created, update) VALUES (%L) RETURNING *', data_daftar_pemasok));
            // debug('get %o', res);
            return { status: '200', permohohan: "Add Daftar Pemasok", data: daftar_pemasok.rows[0] };
        } catch (ex) {
            if (ex.code == '401') {
                return { status: '400', Error: ex.pesan };
            }
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async add_daftar_pelanggan(data) {
        try {
            await check_query.check_data(data)
            let data_daftar_pelanggan = [data.id_pengguna, data.nama, data.alamat, date, date]
            let daftar_pelanggan = await pool.query(
                format('INSERT INTO ' + db_daftar_pelanggan +
                    ' (id_pengguna, nama, alamat, created, update) VALUES (%L) RETURNING *', data_daftar_pelanggan)
            );
            // debug('get %o', res);
            return { status: '200', permohohan: "Add Daftar Pelanggan", data: daftar_pelanggan.rows[0] };
        } catch (ex) {
            if (ex.code == '401') {
                return { status: '400', Error: ex.pesan };
            }
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async add_info_produk(data) {
        try {
            await check_query.check_data(data, ['jenis_klaim', 'nama_merek', 'kelas_mutu', 'sertifikat_jaminan_keamanan_psat', 'berat_bersih'])
            let data_info_produk = [
                data.id_pengguna, data.jenis_psat, data.nama_latin, data.negara_asal, data.nama_dagang, data.jenis_kemasan, data.berat_bersih,
                data.komposisi, data.coa_nomor, data.coa_tanggal, data.desain_tabel_dan_kemasan, data.diagram_alir_psat_luar_negri,
                data.kelas_mutu, data.laporan_hasil_uji_mutu_nomor, data.laporan_hasil_uji_mutu_tanggal,
                data.sertifikat_jaminan_keamanan_psat, data.nama_merek, date, date
            ];
            let sql = format('INSERT INTO ' + db_info_produk +
                ' (id_pengguna, jenis_psat, nama_latin, negara_asal, nama_dagang, jenis_kemasan, berat_bersih, komposisi, coa_nomor, coa_tanggal, ' +
                'desain_tabel_dan_kemasan, diagram_alir_psat_luar_negri, kelas_mutu, laporan_hasil_uji_mutu_nomor, laporan_hasil_uji_mutu_tanggal, ' +
                'sertifikat_jaminan_keamanan_psat, nama_merek, created, update, unit_produksi, daftar_pemasok, daftar_pelanggan, jenis_klaim) VALUES ' +
                `(%L, '{${data.unit_produksi}}', '{${data.daftar_pemasok}}', '{${data.daftar_pelanggan}}', '{${data.jenis_klaim}}') RETURNING *`, data_info_produk)
            let info_produk = await pool.query(sql);
            // debug('get %o', res);
            return { status: '200', permohohan: "Add Info Produk", data: info_produk.rows[0] };
        } catch (ex) {
            if (ex.code == '401') {
                return { status: '400', Error: ex.pesan };
            }
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async update_nomor_izin_edar_pl(data) {
        try {

            await check_query.check_data(data)
            let code_proses = await pool.query('SELECT * FROM ' + db_proses_audit + ' WHERE status=$1', ['Terbit Sertifikat']);
            let data_pengajuan = [data.id_pengajuan, data.id_pengguna, data.status_pengajuan, data.nomor_izin_edar, code_proses.rows[0].code, date];
            let pengajuan = await pool.query(
                'UPDATE' + db_pengajuan +
                ' SET (nomor_izin_edar, status_proses, update) = ($4, $5, $6) WHERE id=$1 AND id_pengguna=$2 AND status_pengajuan=$3 ' +
                'RETURNING id, id_pengguna, status_pengajuan, status_proses, nomor_izin_edar', data_pengajuan);
            check_query.check_queryset(pengajuan);

            return { status: '200', keterangan: `Update  ${data.status_pengajuan} Nomor SPPB PSAT ${data.nomor_izin_edar}`, data: pengajuan.rows[0] };
        } catch (ex) {
            if (ex.code == '401') {
                return { status: '400', Error: ex.pesan };
            }
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async update_permohonan_izin(data) {
        try {
            let response = {};
            await check_query.check_data(data)
            let file_permohonan, pengajuan;

            //Create new file pemohonan
            let data_file_permohonan = [data.surat_permohonan_izin_edar, date];
            file_permohonan = await pool.query(
                format('UPDATE ' + db_file_permohonan +
                    ' SET(surat_permohonan_izin_edar, update) = (%L) ' +
                    `WHERE id_pengguna=${data.id_pengguna} AND id=${data.id_file_permohonan} RETURNING *`, data_file_permohonan)
            );
            check_query.check_queryset(file_permohonan);
            //Create pengajuan
            let data_pengajuan = [true, file_permohonan.rows[0].id, data.status_pengajuan,
                                  data.nama_perseroan, data.alamat_perseroan, data.id_izin_oss, date]
            pengajuan = await pool.query(
                format('UPDATE ' + db_pengajuan +
                    ` SET(status_aktif, file_permohonan, status_pengajuan, id_izin_oss, nama_perusahaan, alamat_perusahaan, update, produk) = (%L, '{${data.info_produk}}') ` +
                    `WHERE id_pengguna=${data.id_pengguna} AND id=${data.id_pengajuan}RETURNING *`, data_pengajuan)
            );

            response.pengajuan = pengajuan.rows[0];
            response.file_permohonan = file_permohonan.rows[0];

            // debug('get %o', response);
            return { status: '200', permohohan: "Update Permohonan izin edar PSAT PL/perpanjangan izin edar PSAT PL", data: response };
        } catch (ex) {
            if (ex.code == '401') {
                return { status: '400', Error: ex.pesan };
            }
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async update_unit_produksi(data) {
        try {
            let data_unit_produksi = [
                data.nama_unit, data.alamat_unit, data.status_kepemilikan, data.durasi_sewa, data.masa_sewa_berakhir,
                data.file_bukti, data.bukti_sewa, data.surat_pernyataan_sppb_psat, data.sppb_psat_nomor, data.sppb_psat_level,
                data.sppb_psat_masa_berlaku, data.sppb_psat_ruang_lingkup, data.sppb_psat_file, date
            ]
            let unit_produksi = await pool.query(
                format('UPDATE ' + db_unit_produksi +
                    ' SET (nama_unit, alamat_unit, status_kepemilikan, durasi_sewa, masa_sewa_berakhir, ' +
                    'file_bukti, bukti_sewa, surat_pernyataan_sppb_psat, sppb_psat_nomor, sppb_psat_level, sppb_psat_masa_berlaku, ' +
                    'sppb_psat_ruang_lingkup, sppb_psat_file, update) = (%L) ' +
                    `WHERE id = ${data.id} AND id_pengguna = ${data.id_pengguna} RETURNING *`, data_unit_produksi)
            );
            check_query.check_queryset(unit_produksi);
            // debug('get %o', res);
            return { status: '200', permohohan: "Update Unit Produksi", data: unit_produksi.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async update_daftar_pemasok(data) {
        try {
            await check_query.check_data(data)
            let data_daftar_pemasok = [data.nama, data.alamat, date]
            let daftar_pemasok = await pool.query(format(
                'UPDATE ' + db_daftar_pemasok + ' SET (nama, alamat, update) = (%L) ' +
                `WHERE id = ${data.id} AND id_pengguna = ${data.id_pengguna} RETURNING *`, data_daftar_pemasok));
            check_query.check_queryset(daftar_pemasok);
            // debug('get %o', res);
            return { status: '200', permohohan: "Update Daftar Pemasok", data: daftar_pemasok.rows[0] };
        } catch (ex) {
            if (ex.code == '401') {
                return { status: '400', Error: ex.pesan };
            }
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async update_daftar_pelanggan(data) {
        try {
            await check_query.check_data(data)
            let data_daftar_pelanggan = [data.nama, data.alamat, date]
            let daftar_pelanggan = await pool.query(
                format('UPDATE ' + db_daftar_pelanggan + ' SET (nama, alamat, update) = (%L) ' +
                    `WHERE id = ${data.id} AND id_pengguna = ${data.id_pengguna} RETURNING *`, data_daftar_pelanggan)
            );
            check_query.check_queryset(daftar_pelanggan);
            // debug('get %o', res);
            return { status: '200', permohohan: "Update Daftar Pelanggan", data: daftar_pelanggan.rows[0] };
        } catch (ex) {
            if (ex.code == '401') {
                return { status: '400', Error: ex.pesan };
            }
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async update_info_produk(data) {
        try {
            await check_query.check_data(data, ['jenis_klaim', 'nama_merek', 'kelas_mutu', 'sertifikat_jaminan_keamanan_psat', 'berat_bersih'])
            let data_info_produk = [
                data.jenis_psat, data.nama_latin, data.negara_asal, data.nama_dagang, data.jenis_kemasan, data.berat_bersih,
                data.komposisi, data.coa_nomor, data.coa_tanggal, data.desain_tabel_dan_kemasan, data.diagram_alir_psat_luar_negri,
                data.kelas_mutu, data.laporan_hasil_uji_mutu_nomor, data.laporan_hasil_uji_mutu_tanggal,
                data.sertifikat_jaminan_keamanan_psat, data.nama_merek, date
            ];
            let sql = format('UPDATE ' + db_info_produk +
                ' SET (jenis_psat, nama_latin, negara_asal, nama_dagang, jenis_kemasan, berat_bersih, komposisi, coa_nomor, coa_tanggal, ' +
                'desain_tabel_dan_kemasan, diagram_alir_psat_luar_negri, kelas_mutu, laporan_hasil_uji_mutu_nomor, laporan_hasil_uji_mutu_tanggal, ' +
                'sertifikat_jaminan_keamanan_psat, nama_merek, update, unit_produksi, daftar_pemasok, daftar_pelanggan, jenis_klaim) = ' +
                `(%L, '{${data.unit_produksi}}', '{${data.daftar_pemasok}}', '{${data.daftar_pelanggan}}', '{${data.jenis_klaim}}') ` +
                `WHERE id = ${data.id} AND id_pengguna = ${data.id_pengguna}RETURNING *`, data_info_produk)
            let info_produk = await pool.query(sql);
            check_query.check_queryset(info_produk);
            // debug('get %o', res);
            return { status: '200', permohohan: "Update Info Produk", data: info_produk.rows[0] };
        } catch (ex) {
            if (ex.code == '401') {
                return { status: '400', Error: ex.pesan };
            }
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async delete_unit_produksi(id) {
        try {
            let unit_produksi = await pool.query('DELETE FROM ' + db_unit_produksi + ` WHERE id = ${id} RETURNING *`)
            check_query.check_queryset(unit_produksi);
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
            check_query.check_queryset(daftar_pemasok);
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
            check_query.check_queryset(daftar_pelanggan);
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
            check_query.check_queryset(info_produk);
            // debug('get %o', res);
            return { status: '200', permohohan: "Delete Info Produk", data: info_produk.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async get_unit_produksi(id) {
        try {
            let unit_produksi;
            if (id == 'all') {
                unit_produksi = await pool.query('SELECT * FROM ' + db_unit_produksi)
            } else {
                unit_produksi = await pool.query('SELECT * FROM ' + db_unit_produksi + ` WHERE id = ${id}`)
            }
            check_query.check_queryset(unit_produksi);
            // debug('get %o', res);
            return { status: '200', permohohan: "Detail Unit Produksi", data: unit_produksi.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async get_daftar_pemasok(id) {
        try {
            let daftar_pemasok;
            if (id == 'all') {
                daftar_pemasok = await pool.query('SELECT * FROM ' + db_daftar_pemasok)
            } else {
                daftar_pemasok = await pool.query('SELECT * FROM ' + db_daftar_pemasok + ` WHERE id = ${id}`)
            }
            check_query.check_queryset(daftar_pemasok);
            // debug('get %o', res);
            return { status: '200', permohohan: "Detail Daftar Pemasok", data: daftar_pemasok.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async get_daftar_pelanggan(id) {
        try {
            let daftar_pelanggan;
            if (id == 'all') {
                daftar_pelanggan = await pool.query('SELECT * FROM ' + db_daftar_pelanggan)
            } else {
                daftar_pelanggan = await pool.query('SELECT * FROM ' + db_daftar_pelanggan + ` WHERE id = ${id}`)
            }
            check_query.check_queryset(daftar_pelanggan);
            // debug('get %o', res);
            return { status: '200', permohohan: "Detail Daftar Pelanggan", data: daftar_pelanggan.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async get_info_produk(id) {
        try {
            let info_produk;
            if (id == 'all') {
                info_produk = await pool.query('SELECT * FROM ' + db_info_produk)
            } else {
                info_produk = await pool.query('SELECT * FROM ' + db_info_produk + ` WHERE id = ${id}`)
            }
            check_query.check_queryset(info_produk);
            // debug('get %o', res);
            return { status: '200', permohohan: "Detail Info Produk", data: info_produk.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async get_permohonan_izin(id, user) {
        try {
            let permohonan;
            if (id == 'all') {
                permohonan = await pool.query(
                    'SELECT id_pengajuan, id_izin_oss, id_izin, nama_perseroan, alamat_perseroan, no_identitas, no_nib, '+
                    ' kode_pengajuan, final_sertifikat, code_status_proses, status_proses, id_pengguna, status_aktif, ' +
                    ' hasil_audit_dokumen, hasil_sidang_komtek, bahan_sidang_komtek, ' +
                    ' keterangan_audit, keterangan_audit_dokumen, keterangan_sidang_komtek, ' +
                    ' id_tim_audit, tim_auditor, lead_auditor, tanggal_penugasan_tim_audit, surat_tugas_tim_audit, ' +
                    ' id_tim_komtek, tim_komtek, lead_komtek, tanggal_penugasan_tim_komtek, surat_tugas_tim_komtek, ' +
                    'status_pengajuan, id_file_permohonan, surat_permohonan_izin_edar, produk, created, update FROM' +
                    db_history_pengajuan + ' WHERE status_pengajuan IN ($1, $2)', ["PERMOHONAN", "PERPANJANGAN"])
            } else {
                permohonan = await pool.query(
                    'SELECT id_pengajuan, id_izin_oss, id_izin, nama_perseroan, alamat_perseroan, no_identitas, no_nib, '+
                    ' kode_pengajuan, final_sertifikat, code_status_proses, status_proses, id_pengguna, status_aktif, ' +
                    ' hasil_audit_dokumen, hasil_sidang_komtek, bahan_sidang_komtek, ' +
                    ' keterangan_audit, keterangan_audit_dokumen, keterangan_sidang_komtek, ' +
                    ' id_tim_audit, tim_auditor, lead_auditor, tanggal_penugasan_tim_audit, surat_tugas_tim_audit, ' +
                    ' id_tim_komtek, tim_komtek, lead_komtek, tanggal_penugasan_tim_komtek, surat_tugas_tim_komtek, ' +
                    'status_pengajuan, id_file_permohonan, surat_permohonan_izin_edar, produk, created, update FROM ' +
                    db_history_pengajuan + ' WHERE status_pengajuan IN ($1, $2) AND id_pengajuan=$3 AND id_pengguna=$4', ["PERMOHONAN", "PERPANJANGAN", id, user])
            }
            check_query.check_queryset(permohonan);
            // debug('get %o', permohonan);
            return { status: '200', keterangan: "Detail Permohonan PSAT PL/Izin Edar PL", data: permohonan.rows[0] };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async get_list_unit_produksi(id) {
        try {
            let unit_produksi;
            if (id == 'all') {
                unit_produksi = await pool.query('SELECT * FROM ' + db_unit_produksi)
            } else {
                unit_produksi = await pool.query('SELECT * FROM ' + db_unit_produksi + ` WHERE id = ANY(ARRAY${id})`)
            }
            check_query.check_queryset(unit_produksi);
            // debug('get %o', res);
            return { status: '200', permohohan: "List Unit Produksi", data: unit_produksi.rows };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async get_list_daftar_pemasok(id) {
        try {
            let daftar_pemasok;
            if (id == 'all') {
                daftar_pemasok = await pool.query('SELECT * FROM ' + db_daftar_pemasok)
            } else {
                daftar_pemasok = await pool.query('SELECT * FROM ' + db_daftar_pemasok + ` WHERE id = ANY(ARRAY${id})`)
            }
            check_query.check_queryset(daftar_pemasok);
            // debug('get %o', res);
            return { status: '200', permohohan: "List Daftar Pemasok", data: daftar_pemasok.rows };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async get_list_daftar_pelanggan(id) {
        try {
            let daftar_pelanggan;
            if (id == 'all') {
                daftar_pelanggan = await pool.query('SELECT * FROM ' + db_daftar_pelanggan)
            } else {
                daftar_pelanggan = await pool.query('SELECT * FROM ' + db_daftar_pelanggan + ` WHERE id = ANY(ARRAY${id})`)
            }
            check_query.check_queryset(daftar_pelanggan);
            // debug('get %o', res);
            return { status: '200', permohohan: "List Daftar Pelanggan", data: daftar_pelanggan.rows };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async get_list_info_produk(id) {
        try {
            let info_produk;
            if (id == 'all') {
                info_produk = await pool.query('SELECT * FROM ' + db_info_produk)
            } else {
                info_produk = await pool.query('SELECT * FROM ' + db_info_produk + ` WHERE id = ANY(ARRAY${id})`)
            }
            check_query.check_queryset(info_produk);
            // debug('get %o', res);
            return { status: '200', permohohan: "List Info Produk", data: info_produk.rows };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async get_history_pengajuan(page, limit, user, code_proses, role, proses_pengajuan, search) {
        try {
            let history, proses, query_select;
            if (user == 'all') {
                history = await pool.query(
                    ' SELECT id_pengajuan, id_pengguna, kbli, id_izin_oss, id_izin, nama_perseroan, alamat_perseroan, no_identitas, no_nib, '+
                    ' kode_pengajuan, final_sertifikat, status_pengajuan, created, nomor_izin_edar, status_proses, code_status_proses, ' +
                    ' id_audit_dokumen, mulai_audit_dokumen, tenggat_audit_dokumen, waktu_tenggat_audit_dokumen, selesai_audit_dokumen, mulai_perbaikan_audit_dokumen, ' +
                    ' tenggat_perbaikan_audit_dokumen, waktu_tenggat_perbaikan_audit_dokumen, selesai_perbaikan_audit_dokumen, keterangan_audit_dokumen, hasil_audit_dokumen, ' +
                    ' id_sidang_komtek, mulai_sidang_komtek, tenggat_sidang_komtek, waktu_tenggat_sidang_komtek, selesai_sidang_komtek, mulai_perbaikan_sidang_komtek, ' +
                    ' tenggat_perbaikan_sidang_komtek, waktu_tenggat_perbaikan_sidang_komtek, selesai_perbaikan_sidang_komtek, keterangan_sidang_komtek, hasil_sidang_komtek, bahan_sidang_komtek' +
                    ' bukti_pembayaran_pnbp, tanggal_pembayaran_pnbp, dokumen_ditolak, tanggal_dokumen_ditolak, keterangan_audit, ' +
                    ' id_tim_audit, tim_auditor, lead_auditor, tanggal_penugasan_tim_audit, surat_tugas_tim_audit, ' +
                    ' id_tim_komtek, tim_komtek, lead_komtek, tanggal_penugasan_tim_komtek, surat_tugas_tim_komtek FROM' + db_history_pengajuan + ' ORDER BY created DESC')
            } else {
                if (code_proses == 'all') {
                    proses = check_query.proses_code_all(user, code_proses, role, proses_pengajuan, 'IZIN_EDAR', search);
                    query_select =
                        ' id_pengajuan, id_pengguna, kbli, id_izin_oss, id_izin, nama_perseroan, alamat_perseroan, no_identitas, no_nib, '+
                        ' kode_pengajuan, final_sertifikat, status_pengajuan, created, nomor_izin_edar, status_proses, code_status_proses, ' +
                        ' id_audit_dokumen, mulai_audit_dokumen, tenggat_audit_dokumen, waktu_tenggat_audit_dokumen, selesai_audit_dokumen, mulai_perbaikan_audit_dokumen, ' +
                        ' tenggat_perbaikan_audit_dokumen, waktu_tenggat_perbaikan_audit_dokumen, selesai_perbaikan_audit_dokumen, keterangan_audit_dokumen, hasil_audit_dokumen, ' +
                        ' id_sidang_komtek, mulai_sidang_komtek, tenggat_sidang_komtek, waktu_tenggat_sidang_komtek, selesai_sidang_komtek, mulai_perbaikan_sidang_komtek, ' +
                        ' tenggat_perbaikan_sidang_komtek, waktu_tenggat_perbaikan_sidang_komtek, selesai_perbaikan_sidang_komtek, keterangan_sidang_komtek, hasil_sidang_komtek, bahan_sidang_komtek' +
                        ' bukti_pembayaran_pnbp, tanggal_pembayaran_pnbp, dokumen_ditolak, tanggal_dokumen_ditolak, keterangan_audit, ' +
                        ' id_tim_audit, tim_auditor, lead_auditor, tanggal_penugasan_tim_audit, surat_tugas_tim_audit, ' +
                        ' id_tim_komtek, tim_komtek, lead_komtek, tanggal_penugasan_tim_komtek, surat_tugas_tim_komtek'
                } else {
                    proses = await check_query.proses_code(user, code_proses, role, proses_pengajuan, 'IZIN_EDAR', search);

                    if (code_proses == '10' || code_proses == '11') {
                        query_select =
                            ' id_pengajuan, id_pengguna, kbli, id_izin_oss, id_izin, nama_perseroan, alamat_perseroan, no_identitas, no_nib, '+
                            ' kode_pengajuan, final_sertifikat, status_pengajuan, created, nomor_izin_edar, status_proses, code_status_proses, ' +
                            ' id_audit_dokumen, mulai_audit_dokumen, tenggat_audit_dokumen, waktu_tenggat_audit_dokumen, selesai_audit_dokumen, mulai_perbaikan_audit_dokumen, ' +
                            ' tenggat_perbaikan_audit_dokumen, waktu_tenggat_perbaikan_audit_dokumen, selesai_perbaikan_audit_dokumen, keterangan_audit_dokumen, hasil_audit_dokumen'
                    } else if (code_proses == '20' || code_proses == '21') {
                        query_select =
                            ' id_pengajuan, id_pengguna, kbli, id_izin_oss, id_izin, nama_perseroan, alamat_perseroan, no_identitas, no_nib, '+
                            ' kode_pengajuan, final_sertifikat, status_pengajuan, created, nomor_izin_edar, status_proses, code_status_proses, ' +
                            ' id_audit_dokumen, mulai_audit_dokumen, tenggat_audit_dokumen, waktu_tenggat_audit_dokumen, selesai_audit_dokumen, mulai_perbaikan_audit_dokumen, ' +
                            ' tenggat_perbaikan_audit_dokumen, waktu_tenggat_perbaikan_audit_dokumen, selesai_perbaikan_audit_dokumen, keterangan_audit_dokumen, hasil_audit_dokumen, ' +
                            ' id_tim_audit, tim_auditor, lead_auditor, tanggal_penugasan_tim_audit, surat_tugas_tim_audit, ' +
                            ' id_tim_komtek, tim_komtek, lead_komtek, tanggal_penugasan_tim_komtek, surat_tugas_tim_komtek'
                    } else if (code_proses == '40' || code_proses == '41') {
                        query_select =
                            ' id_pengajuan, id_pengguna, kbli, id_izin_oss, id_izin, nama_perseroan, alamat_perseroan, no_identitas, no_nib, '+
                            ' kode_pengajuan, final_sertifikat, status_pengajuan, created, nomor_izin_edar, status_proses, code_status_proses, ' +
                            ' id_sidang_komtek, mulai_sidang_komtek, tenggat_sidang_komtek, waktu_tenggat_sidang_komtek, selesai_sidang_komtek, mulai_perbaikan_sidang_komtek, ' +
                            ' tenggat_perbaikan_sidang_komtek, waktu_tenggat_perbaikan_sidang_komtek, selesai_perbaikan_sidang_komtek, keterangan_sidang_komtek, hasil_sidang_komtek, bahan_sidang_komtek' +
                            ' id_tim_audit, tim_auditor, lead_auditor, tanggal_penugasan_tim_audit, surat_tugas_tim_audit, ' +
                            ' id_tim_komtek, tim_komtek, lead_komtek, tanggal_penugasan_tim_komtek, surat_tugas_tim_komtek'
                    } else if (code_proses == '50' || code_proses == '51') {
                        query_select =
                            ' id_pengajuan, id_pengguna, kbli, id_izin_oss, id_izin, nama_perseroan, alamat_perseroan, no_identitas, no_nib, kode_pengajuan, '+
                            'final_sertifikat, status_pengajuan, created, nomor_izin_edar, status_proses, code_status_proses, ' +
                            ' bukti_pembayaran_pnbp, tanggal_pembayaran_pnbp '
                    } else if (code_proses == '99') {
                        query_select =
                            ' id_pengajuan, id_pengguna, kbli, id_izin_oss, id_izin, nama_perseroan, alamat_perseroan, no_identitas, no_nib, '+
                            ' kode_pengajuan, final_sertifikat, status_pengajuan, created, nomor_izin_edar, status_proses, code_status_proses, ' +
                            ' dokumen_ditolak, tanggal_dokumen_ditolak, keterangan_audit'
                    } else {
                        query_select =
                            ' id_pengajuan, id_pengguna, kbli, id_izin_oss, id_izin, nama_perseroan, alamat_perseroan, no_identitas, no_nib, kode_pengajuan, final_sertifikat, status_pengajuan, created, nomor_izin_edar, status_proses, code_status_proses '
                    }
                }
            }
            history = await check_query.pagination(page, limit, proses.filter, proses.data, query_select, db_history_pengajuan)
            return {
                status: '200',
                keterangan: `History PSAT PL role ${role} id ${user} Code Proses: ${proses.code} ${proses_pengajuan}`,
                data: history
            };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

}
module.exports = new PsatPlPermohonanModel();