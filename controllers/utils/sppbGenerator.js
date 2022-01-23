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
let masa_berlaku = new Date(new Date().setFullYear(new Date().getFullYear() + 5))
class sppbGenerator {
    async sppb_pengalihan(sertifikat_psat, unit_produksi, def, requstType) {
        let data
        if (requstType == "GET") {
            let detail_unit = unit_produksi.map(data_prod => {

                return {
                    nama_unit: data_prod.nama_unit,
                    alamat_unit: data_prod.alamat_unit,
                    status_kepemilikan: data_prod.status_kepemilikan,

                    nomor_sppb_psat: data_prod.nomor_sppb_psat,
                    level: data_prod.level,
                    masa_sewa_berakhir: data_prod.masa_sewa_berakhir,
                    ruang_lingkup: data_prod.ruang_lingkup
                }
            })
            let filename = await 'sertifikat/sppb-psat/permohonan-unit-penanganan-' + sertifikat_psat.id_pengajuan + '.pdf'
            const templatePath = Path.resolve('models', 'template_pdf', 'OSS_SPPB_UNIT.html')
            const content = await ReadFile(templatePath, 'utf8')

            const template = Handlebars.compile(content)
            const pdf = await generatePdf.pdf(template(detail_unit), filename);
            let sertifikat_unit_penanganan = url + filename

            data = {
                nama_pemilik_lama: sertifikat_psat.nama_pemilik_lama,
                alamat_pemilik_lama: sertifikat_psat.alamat_pemilik_lama,
                nama_perusahaan: sertifikat_psat.nama_perusahaan,
                nama_pemilik_baru: sertifikat_psat.nama_pemilik_baru,
                alamat_pemilik_baru: sertifikat_psat.alamat_pemilik_baru,
                nama_perusahaan: sertifikat_psat.nama_perusahaan,
                sertifikat_unit_penanganan: sertifikat_unit_penanganan,
                detail_unit: detail_unit


            }
            return {
                view_only: true,
                message: "Sertifikat SPPB-PSAT",
                type: 'PENGALIHAN',
                path: sertifikat_psat.final_sertifikat,
                data: data
            }
        } else {
            data = {
                nama_pemilik_lama: def.nama_pemilik_lama,
                alamat_pemilik_lama: def.alamat_pemilik_lama,
                nama_perusahaan: def.nama_perusahaan,
                nama_pemilik_baru: def.nama_pemilik_baru,
                alamat_pemilik_baru: def.alamat_pemilik_baru,
                nama_perusahaan: def.nama_perusahaan,
                sertifikat_unit_penanganan: def.sertifikat_unit_penanganan


            }

            ////////////////////////////////////////////////////
            // EXPORT TO PDF //
            ///////////////////////////////////////////////////
            let filename = await 'sertifikat/sppb-psat/pengalihan-' + sertifikat_psat.id_pengguna + '-' + sertifikat_psat.id_pengajuan + '.pdf'
            const templatePath = Path.resolve('models', 'template_pdf', 'OSS_SPPB_PSAT_PENGALIHAN_KEPEMILIKAN.html')

            const content = await ReadFile(templatePath, 'utf8')
                // compile and render the template with handlebars
            const template = Handlebars.compile(content)

            const pdf = await generatePdf.pdf(template(data), filename);
            let path_sertifikat = url + filename


            //////////////////////////////////////////////////
            // UPDATE DATA //
            /////////////////////////////////////////////////
            let data_pengajuan = [sertifikat_psat.id_pengguna, sertifikat_psat.id_pengajuan, path_sertifikat, def.level, def.ruang_lingkup, masa_berlaku, date, def.nama_unit_penanganan, def.alamat_unit_penanganan];
            let pengajuan = await pool.query(
                'UPDATE ' + db_pengajuan_sppb_psat +
                ' SET (final_sertifikat, level, ruang_lingkup, masa_berlaku, update, nama_unit_penanganan, alamat_unit_penanganan) = ($3, $4, $5, $6, $7, $8, $9) WHERE id_pengguna=$1 AND id_pengajuan=$2  ' +
                'RETURNING *', data_pengajuan);

            let data_perushaaan = [sertifikat_psat.id_info_perusahaan, sertifikat_psat.id_pengguna, def.nama_pemilik_lama, def.alamat_pemilik_lama, def.nama_perusahaan, def.nama_pemilik_baru, def.alamat_pemilik_baru, def.status_kepemilikan, date];
            let pengajuan_perushaan = await pool.query(
                'UPDATE  ' + db_perusahaan_sppb_psat +
                ' SET (nama_pemilik_lama, alamat_pemilik_lama, nama_perusahaan, nama_pemilik_baru, alamat_pemilik_baru, status_kepemilikan,  update) = ($3, $4, $5, $6, $7,$8, $9) WHERE id=$1 AND id_pengguna=$2  ' +
                'RETURNING *', data_perushaaan);


            var pdfsToMerge = []
            pdfsToMerge.push(fs.readFileSync(filename))
            if (def.sertifikat_unit_penanganan != null) {
                pdfsToMerge.push(fs.readFileSync(def.sertifikat_unit_penanganan))
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
                message: "Sertifikat SPPB-PSAT",
                type: 'PENGALIHAN',
                path: path_sertifikat,
                data: data
            }
        }


    }
    async sppb_permohonan(sertifikat_psat, def, requstType) {

        let nama_unit_penanganan = sertifikat_psat.nama_unit_penanganan
        let alamat_unit_penanganan = sertifikat_psat.alamat_unit_penanganan

        if (sertifikat_psat.nama_unit_penanganan == null) {
            nama_unit_penanganan = sertifikat_psat.nama_perusahaan
        }
        if (sertifikat_psat.alamat_unit_penanganan == null) {
            alamat_unit_penanganan = sertifikat_psat.alamat_perusahaan
        }

        let data = {

            pbumku: "pbumku",
            nama_unit_penanganan: nama_unit_penanganan,
            alamat_unit_penanganan: alamat_unit_penanganan,
            status_kepemilikan: sertifikat_psat.status_kepemilikan,
            nomor_sppb_psat: sertifikat_psat.nomor_sppb_psat,
            level: sertifikat_psat.level,
            ruang_lingkup: sertifikat_psat.ruang_lingkup,
            masa_berlaku: masa_berlaku

        }
        if (requstType == "GET") {
            return {
                view_only: true,
                message: "Sertifikat SPPB-PSAT",
                type: 'PERMOHONAN',
                path: sertifikat_psat.final_sertifikat,
                data: data
                    //     pengajuan: data_pengajuan
            }

        } else {

            let data_new = {

                pbumku: "pbumku",
                nama_unit_penanganan: def.nama_unit_penanganan,
                alamat_unit_penanganan: def.alamat_unit_penanganan,
                status_kepemilikan: def.status_kepemilikan,
                nomor_sppb_psat: def.nomor_sppb_psat,
                level: def.level,
                ruang_lingkup: def.ruang_lingkup,
                masa_berlaku: masa_berlaku

            }

            ////////////////////////////////////////////////////
            // EXPORT TO PDF //
            ///////////////////////////////////////////////////

            let filename = await 'sertifikat/sppb-psat/permohonan-' + sertifikat_psat.id_pengguna + '-' + sertifikat_psat.id_pengajuan + '-' + def.nomor_sppb_psat + '.pdf'
            const templatePath = Path.resolve('models', 'template_pdf', 'OSS_SPPB_PSAT.html')

            const content = await ReadFile(templatePath, 'utf8')
                // compile and render the template with handlebars
            const template = Handlebars.compile(content)

            const pdf = await generatePdf.pdf(template(data_new), filename);
            let path_sertifikat = url + filename

            //////////////////////////////////////////////////
            // UPDATE DATA //
            /////////////////////////////////////////////////

            let data_pengajuan = [sertifikat_psat.id_pengguna, sertifikat_psat.id_pengajuan, path_sertifikat, def.nomor_sppb_psat, def.level, def.ruang_lingkup, masa_berlaku, date, def.nama_unit_penanganan, def.alamat_unit_penanganan];
            let pengajuan = await pool.query(
                'UPDATE ' + db_pengajuan_sppb_psat +
                ' SET (final_sertifikat, nomor_sppb_psat, level, ruang_lingkup, masa_berlaku, update, nama_unit_penanganan, alamat_unit_penanganan) = ($3, $4, $5, $6, $7, $8, $9, $10) WHERE id_pengguna=$1 AND id_pengajuan=$2  ' +
                'RETURNING *', data_pengajuan);

            let data_perushaaan = [sertifikat_psat.id_info_perusahaan, sertifikat_psat.id_pengguna, def.status_kepemilikan, date];
            let pengajuan_perushaan = await pool.query(
                'UPDATE  ' + db_perusahaan_sppb_psat +
                ' SET (status_kepemilikan, update) = ($3, $4) WHERE id=$1 AND id_pengguna=$2  ' +
                'RETURNING *', data_perushaaan);


            return {
                view_only: false,
                message: "Sertifikat SPPB-PSAT",
                type: 'PERMOHONAN',
                path: path_sertifikat,
                data: data_new
            }

        }
    }

}

module.exports = new sppbGenerator();