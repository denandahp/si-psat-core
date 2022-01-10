const pool = require('../../libs/db');
var format = require('pg-format');
const fs = require('fs');
const puppeteer = require('puppeteer');
const Handlebars = require('handlebars');
const Fs = require('fs')
const Path = require('path')
const Util = require('util')
const ReadFile = Util.promisify(Fs.readFile)
const generatePdf = require("../../models/generatePdf.js")
const sppb_psat_view = require('../../models/sppb_psat_view.js')
const sppb_pl_view = require('../../models/sppb_pl_view.js')
const authUtils = require('./auth');
const PDFMerge = require('pdf-merge');
const PDFDocument = require('pdf-lib').PDFDocument;
const { query } = require('../../libs/db');

const url = '/root/si-psat-core/'

const db_pengajuan_sppb_psat = 'sppb_psat.sertifikat_psat';
const db_perusahaan_sppb_psat = 'sppb_psat.info_perusahaan';
const db_pengajuan_izin_edar = 'izin_edar.pengajuan';

var date = new Date(Date.now());
date.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
let berlaku_sampai = new Date(new Date().setFullYear(new Date().getFullYear() + 5))

class izinedarGenerator {

    async pengalihan(sertifikat_pl, unit_produksi, def, requstType) {
        let data;
        if (requstType == "GET") {
            data = {

                "pbumku": "pbumku",
                "nama_pemilik_lama": sertifikat_pl.nama_pemilik_lama,
                "alamat_pemilik_lama": sertifikat_pl.alamat_pemilik_lama,
                "nama_pemilik_baru": sertifikat_pl.nama_pemilik_baru,
                "alamat_pemilik_baru": sertifikat_pl.alamat_pemilik_baru,
                "unit_penanganan": " ",
                "nama_unit": unit_produksi.nama_unit,
                "alamat_unit": unit_produksi.alamat_unit,
                "status_kepemilikan": unit_produksi.status_kepemilikan,
                "sppb_psat": " ",
                "sppb_psat_nomor": unit_produksi.sppb_psat_nomor,
                "sppb_psat_level": unit_produksi.sppb_psat_level,
                "sppb_psat_masa_berlaku": unit_produksi.sppb_psat_masa_berlaku,
                "sppb_psat_ruang_lingkup": unit_produksi.sppb_psat_ruang_lingkup

            }

            return {
                view_only: true,
                message: "Sertifikat PSAT PL",
                type: 'PENGALIHAN',
                data: data
            }
        }
    }
    async perubahandata(sertifikat_pl, unit_produksi, def, requstType) {
        let data;

        if (requstType == "GET") {
            data = {

                "pbumku": "pbumku",
                "nama_psat": "",
                "jenis_psat": sertifikat_pl.jenis_psat,
                "nama_dagang": sertifikat_pl.nama_dagang,
                "izin_psat_pl": " ",
                "nomor_izin_edar": sertifikat_pl.nomor_izin_edar,
                "berlaku_sampai": berlaku_sampai,
                "nama_latin": sertifikat_pl.nama_latin,
                "negara_asal": sertifikat_pl.negara_asal,
                "nama_merk": sertifikat_pl.nama_merek,
                "jenis_kemasan_lama": sertifikat_pl.jenis_kemasan,
                "berat_bersih_lama": sertifikat_pl.berat_bersih,
                "jenis_kemasan_baru": null,
                "berat_bersih_baru": null,
                "unit_penanganan": " ",
                "nama_unit": unit_produksi.nama_unit,
                "alamat_unit": unit_produksi.alamat_unit,
                "status_kepemilikan": unit_produksi.status_kepemilikan,
                "sppb_psat": " ",
                "sppb_psat_nomor": unit_produksi.sppb_psat_nomor,
                "sppb_psat_level": unit_produksi.sppb_psat_level,
                "sppb_psat_masa_berlaku": unit_produksi.sppb_psat_masa_berlaku,
                "sppb_psat_ruang_lingkup": unit_produksi.sppb_psat_ruang_lingkup,
                "kelas_mutu": sertifikat_pl.kelas_mutu,
                "jenis_klaim": sertifikat_pl.jenis_klaim,
                "desain_tabel_dan_kemasan": sertifikat_pl.desain_tabel_dan_kemasan,
                "desain_tabel_dan_kemasan_baru": null

            }

            return {
                view_only: true,
                message: "Sertifikat PSAT PL",
                type: 'PERUBAHAN DATA',
                path: sertifikat_pl.final_sertifikat,
                data: data
            }
        } else {
            data = {

                "pbumku": "pbumku",
                "nama_psat": "",
                "jenis_psat": def.jenis_psat,
                "nama_dagang": def.nama_dagang,
                "izin_psat_pl": " ",
                "nomor_izin_edar": def.nomor_izin_edar,
                "berlaku_sampai": berlaku_sampai,
                "nama_latin": def.nama_latin,
                "negara_asal": def.negara_asal,
                "nama_merk": def.nama_merek,
                "jenis_kemasan_lama": def.jenis_kemasan_lama,
                "berat_bersih_lama": def.berat_bersih_lama,
                "jenis_kemasan_baru": def.jenis_kemasan_baru,
                "berat_bersih_baru": def.jenis_kemasan_baru,
                "unit_penanganan": " ",
                "nama_unit": def.nama_unit,
                "alamat_unit": def.alamat_unit,
                "status_kepemilikan": def.status_kepemilikan,
                "sppb_psat": " ",
                "sppb_psat_nomor": def.sppb_psat_nomor,
                "sppb_psat_level": def.sppb_psat_level,
                "sppb_psat_masa_berlaku": def.sppb_psat_masa_berlaku,
                "sppb_psat_ruang_lingkup": def.sppb_psat_ruang_lingkup,
                "kelas_mutu": def.kelas_mutu,
                "jenis_klaim": def.jenis_klaim,
                "desain_tabel_dan_kemasan": def.desain_tabel_dan_kemasan,
                "desain_tabel_dan_kemasan_baru": def.desain_tabel_dan_kemasan_baru

            }

            ////////////////////////////////////////////////////
            // EXPORT TO PDF //
            ///////////////////////////////////////////////////

            let filename = await 'sertifikat/psat-pl/perubahan-' + sertifikat_pl.id_pengguna + '-' + sertifikat_pl.id_pengajuan + '-' + def.nomor_izin_edar + '.pdf'
            const templatePath = Path.resolve('models', 'template_pdf', 'OSS_IZIN_EDAR_PERUBAHAN_DATA.html')

            const content = await ReadFile(templatePath, 'utf8')
                // compile and render the template with handlebars
            const template = Handlebars.compile(content)

            const pdf = await generatePdf.pdf(template(data), filename);

            let path_sertifikat = url + filename

            //////////////////////////////////////////////////
            // UPDATE DATA //
            /////////////////////////////////////////////////


            let data_pengajuan = [sertifikat_pl.id_pengajuan, sertifikat_pl.id_pengguna, sertifikat_pl.status_pengajuan, path_sertifikat, date, def.nomor_izin_edar, berlaku_sampai];
            let pengajuan = await pool.query(
                'UPDATE ' + db_pengajuan_izin_edar +
                ' SET (final_sertifikat, update, nomor_izin_edar, expire_sertifikat) = ($4, $5, $6, $7) WHERE id=$1 AND id_pengguna=$2 AND status_pengajuan=$3 ' +
                'RETURNING id, id_pengguna, status_pengajuan, status_proses, final_sertifikat', data_pengajuan);


            let data_produk = [sertifikat_pl.produk[0], def.jenis_psat, def.nama_dagang, def.nama_latin, def.negara_asal, def.nama_merek, def.jenis_kemasan_baru, def.berat_bersih_baru, def.kelas_mutu, def.jenis_klaim, def.desain_tabel_dan_kemasan];
            let info_produk = await pool.query(
                'UPDATE izin_edar.info_produk' +
                ' SET (jenis_psat, nama_dagang, nama_latin, negara_asal, nama_merek, jenis_kemasan, berat_bersih, kelas_mutu, jenis_klaim, desain_tabel_dan_kemasan) = ($2, $3, $4, $5, $6, $7, $8, $9, $10, $11) WHERE id=$1' +
                'RETURNING *', data_produk);

            let data_produksi = [sertifikat_pl.id_pengguna, def.nama_unit, def.alamat_unit, def.status_kepemilikan, def.sppb_psat_nomor, def.sppb_psat_level, def.sppb_psat_masa_berlaku, def.sppb_psat_ruang_lingkup];
            let unit_produksi = await pool.query(
                'UPDATE izin_edar.unit_produksi' +
                ' SET (nama_unit, alamat_unit, status_kepemilikan, sppb_psat_nomor, sppb_psat_level, sppb_psat_masa_berlaku, sppb_psat_ruang_lingkup) = ($2, $3, $4, $5, $6, $7, $8) WHERE id_pengguna=$1' +
                'RETURNING *', data_produksi);


            // res.set("Content-Type", "application/pdf");
            var pdfsToMerge = []
            pdfsToMerge.push(fs.readFileSync(filename))
                //	    pdfsToMerge.push(fs.readFileSync(filename))

            if (def.kelas_mutu != null) {
                pdfsToMerge.push(fs.readFileSync(def.kelas_mutu))
            }
            if (def.jenis_klaim != null) {

                pdfsToMerge.push(fs.readFileSync(def.jenis_klaim[0]))
            }
            if (def.desain_tabel_dan_kemasan != null) {
                pdfsToMerge.push(fs.readFileSync(def.desain_tabel_dan_kemasan))
            }
            if (def.desain_tabel_dan_kemasan != null) {
                pdfsToMerge.push(fs.readFileSync(def.desain_tabel_dan_kemasan_baru))
            }


            const mergedPdf = await PDFDocument.create();
            for (const pdfBytes of pdfsToMerge) {
                const pdf = await PDFDocument.load(pdfBytes);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page) => {
                    mergedPdf.addPage(page);
                });
            }

            const buf = await mergedPdf.save(); // Uint8Array

            let path = filename;
            fs.open(path, 'w', function(err, fd) {
                fs.write(fd, buf, 0, buf.length, null, function(err) {
                    fs.close(fd, function() {
                        console.log('wrote the file successfully');
                    });
                });
            });

            return {
                view_only: false,
                message: "Sertifikat PSAT PL",
                type: 'PERUBAHAN DATA',
                path: path_sertifikat,
                data: data
            }
        }

    }
    async permohonan(sertifikat_pl, unit_produksi, def, requstType) {
        if (requstType == "GET") {
            let data = {

                "pbumku": "pbumku",
                "nama_psat": "",
                "jenis_psat": sertifikat_pl.jenis_psat,
                "nama_dagang": sertifikat_pl.nama_dagang,
                "izin_psat_pl": " ",
                "nomor_izin_edar": sertifikat_pl.nomor_izin_edar,
                "berlaku_sampai": berlaku_sampai,
                "nama_latin": sertifikat_pl.nama_latin,
                "negara_asal": sertifikat_pl.negara_asal,
                "nama_merk": sertifikat_pl.nama_merek,
                "jenis_kemasan": sertifikat_pl.jenis_kemasan,
                "berat_bersih": sertifikat_pl.berat_bersih,
                "unit_penanganan": " ",
                "nama_unit": unit_produksi.nama_unit,
                "alamat_unit": unit_produksi.alamat_unit,
                "status_kepemilikan": unit_produksi.status_kepemilikan,
                "sppb_psat": " ",
                "sppb_psat_nomor": unit_produksi.sppb_psat_nomor,
                "sppb_psat_level": unit_produksi.sppb_psat_level,
                "sppb_psat_masa_berlaku": unit_produksi.sppb_psat_masa_berlaku,
                "sppb_psat_ruang_lingkup": unit_produksi.sppb_psat_ruang_lingkup,
                "kelas_mutu": sertifikat_pl.kelas_mutu,
                "jenis_klaim": sertifikat_pl.jenis_klaim,
                "desain_tabel_dan_kemasan": sertifikat_pl.desain_tabel_dan_kemasan

            }

            return {
                view_only: true,
                message: "Sertifikat PSAT PL",
                type: 'PERMOHONAN',
                path: sertifikat_pl.final_sertifikat,
                data: data
            }

        } else {

            let data_new = {

                "pbumku": "pbumku",
                "nama_psat": "nama_psat",
                "jenis_psat": def.jenis_psat,
                "nama_dagang": def.nama_dagang,
                "izin_psat_pl": " ",
                "nomor_izin_edar": def.nomor_izin_edar,
                "berlaku_sampai": berlaku_sampai,
                "nama_latin": def.nama_latin,
                "negara_asal": def.negara_asal,
                "nama_merk": def.nama_merek,
                "jenis_kemasan": def.jenis_kemasan,
                "berat_bersih": def.berat_bersih,
                "unit_penanganan": " ",
                "nama_unit": def.nama_unit,
                "alamat_unit": def.alamat_unit,
                "status_kepemilikan": def.status_kepemilikan,
                "sppb_psat": " ",
                "sppb_psat_nomor": def.sppb_psat_nomor,
                "sppb_psat_level": def.sppb_psat_level,
                "sppb_psat_masa_berlaku": def.sppb_psat_masa_berlaku,
                "sppb_psat_ruang_lingkup": def.sppb_psat_ruang_lingkup,
                "kelas_mutu": def.kelas_mutu,
                "jenis_klaim": def.jenis_klaim,
                "desain_tabel_dan_kemasan": def.desain_tabel_dan_kemasan

            }

            let filename = await 'sertifikat/psat-pl/permohonan-' + sertifikat_pl.id_pengguna + '-' + sertifikat_pl.id_pengajuan + '-' + def.nomor_izin_edar + '.pdf'
            const templatePath = Path.resolve('models', 'template_pdf', 'OSS_PL.html')

            const content = await ReadFile(templatePath, 'utf8')
                // compile and render the template with handlebars
            const template = Handlebars.compile(content)

            const pdf = await generatePdf.pdf(template(data_new), filename);

            let path_sertifikat = url + filename

            let data_pengajuan = [sertifikat_pl.id_pengajuan, sertifikat_pl.id_pengguna, sertifikat_pl.status_pengajuan, path_sertifikat, date, def.nomor_izin_edar, berlaku_sampai];
            let pengajuan = await pool.query(
                'UPDATE ' + db_pengajuan_izin_edar +
                ' SET (final_sertifikat, update, nomor_izin_edar, expire_sertifikat) = ($4, $5, $6, $7) WHERE id=$1 AND id_pengguna=$2 AND status_pengajuan=$3 ' +
                'RETURNING id, id_pengguna, status_pengajuan, status_proses, final_sertifikat', data_pengajuan);


            let data_produk = [sertifikat_pl.produk[0], def.jenis_psat, def.nama_dagang, def.nama_latin, def.negara_asal, def.nama_merek, def.jenis_kemasan, def.berat_bersih, def.kelas_mutu, def.jenis_klaim, def.desain_tabel_dan_kemasan];
            let info_produk = await pool.query(
                'UPDATE izin_edar.info_produk' +
                ' SET (jenis_psat, nama_dagang, nama_latin, negara_asal, nama_merek, jenis_kemasan, berat_bersih, kelas_mutu, jenis_klaim, desain_tabel_dan_kemasan) = ($2, $3, $4, $5, $6, $7, $8, $9, $10, $11) WHERE id=$1' +
                'RETURNING *', data_produk);

            let data_produksi = [sertifikat_pl.id_pengguna, def.nama_unit, def.alamat_unit, def.status_kepemilikan, def.sppb_psat_nomor, def.sppb_psat_level, def.sppb_psat_masa_berlaku, def.sppb_psat_ruang_lingkup];
            let unit_produksi = await pool.query(
                'UPDATE izin_edar.unit_produksi' +
                ' SET (nama_unit, alamat_unit, status_kepemilikan, sppb_psat_nomor, sppb_psat_level, sppb_psat_masa_berlaku, sppb_psat_ruang_lingkup) = ($2, $3, $4, $5, $6, $7, $8) WHERE id_pengguna=$1' +
                'RETURNING *', data_produksi);


            // res.set("Content-Type", "application/pdf");
            var pdfsToMerge = []
            pdfsToMerge.push(fs.readFileSync(filename))
                //	    pdfsToMerge.push(fs.readFileSync(filename))

            if (def.kelas_mutu != null) {

                pdfsToMerge.push(fs.readFileSync(def.kelas_mutu))
            }

            if (def.jenis_klaim != null) {

                pdfsToMerge.push(fs.readFileSync(def.jenis_klaim[0]))
            }

            if (def.desain_tabel_dan_kemasan != null) {
                pdfsToMerge.push(fs.readFileSync(def.desain_tabel_dan_kemasan))
            }


            const mergedPdf = await PDFDocument.create();
            for (const pdfBytes of pdfsToMerge) {
                const pdf = await PDFDocument.load(pdfBytes);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page) => {
                    mergedPdf.addPage(page);
                });
            }

            const buf = await mergedPdf.save(); // Uint8Array

            let path = filename;
            fs.open(path, 'w', function(err, fd) {
                fs.write(fd, buf, 0, buf.length, null, function(err) {
                    fs.close(fd, function() {
                        console.log('wrote the file successfully');
                    });
                });
            });

            return {
                view_only: false,
                message: "Sertifikat PSAT PL",
                type: 'PERMOHONAN',
                path: path_sertifikat,
                data: data_new
            }
        }
    }
}


module.exports = new izinedarGenerator();