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
const authUtils = require('../utils/auth');
const PDFMerge = require('pdf-merge');
const PDFDocument = require('pdf-lib').PDFDocument

const url = '103.161.184.37:3000/api/upload/view_pdf?path=/root/si-psat-core/'

const db_pengajuan_sppb_psat = 'sppb_psat.sertifikat_psat';
const db_pengajuan_izin_edar = 'izin_edar.pengajuan';


var date = new Date(Date.now());
date.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
class generatePdfController {
    async sppb_psat(req, res, next) {
        let callback = async() => {
            // try {
            const def = req.body
            const param = req.params
            const sertifikat_psat = await sppb_psat_view.view_sertifikat(param)

            let data = {

                pbumku: "pbumku",
                nama_unit_penanganan: sertifikat_psat.nama_perusahaan,
                alamat_unit_penanganan: sertifikat_psat.alamat_perusahaan,
                status_kepemilikan: sertifikat_psat.status_kepemilikan,
                no_sppb_psat: def.no_sppb_psat,
                level_sppb_psat: def.level_sppb_psat,
                ruang_lingkup: def.ruang_lingkup,
                berlaku_sampai: def.berlaku_sampai

            }
            let filename = await 'sertifikat/sppb-psat/' + sertifikat_psat.id_pengguna + '-' + sertifikat_psat.id_pengajuan + '-' + def.no_sppb_psat + '.pdf'
            const templatePath = Path.resolve('models', 'template_pdf', 'OSS_SPPB_PSAT.html')

            const content = await ReadFile(templatePath, 'utf8')
                // compile and render the template with handlebars
            const template = Handlebars.compile(content)

            const pdf = await generatePdf.pdf(template(data), filename);
            let path_sertifikat = url + filename

            let data_pengajuan = [sertifikat_psat.id_pengguna, sertifikat_psat.id_pengajuan, path_sertifikat, def.no_sppb_psat, def.level_sppb_psat, def.ruang_lingkup, def.berlaku_sampai, date];
            let pengajuan = await pool.query(
                'UPDATE ' + db_pengajuan_sppb_psat +
                ' SET (final_sertifikat, nomor_sppb_psat, level, ruang_lingkup, masa_berlaku, update) = ($3, $4, $5, $6, $7, $8) WHERE id_pengguna=$1 AND id_pengajuan=$2  ' +
                'RETURNING id_pengguna, id_pengajuan, final_sertifikat, nomor_sppb_psat, level, ruang_lingkup, masa_berlaku, update', data_pengajuan);



            res.status(200).json({
                message: "Sertifikat SPPB-PSAT",
                path: path_sertifikat,
                data: data,
                pengajuan: data_pengajuan
            });


            // } catch (e) {
            //     next(e.detail || e);
            // }
        };
        let fallback = (err) => {
            next(err);
        }
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async psat_pl(req, res, next) {
        let callback = async() => {
            // try {
            const def = req.body
            const param = req.params
            let sertifikat_pl = await sppb_pl_view.view_sertifikat(param)
            let unit_produksi = await sppb_pl_view.view_unitproduksi(param)


            let data = {

                "pbumku": "pbumku",
                "nama_psat": "nama_psat",
                "jenis_psat": sertifikat_pl.jenis_psat,
                "nama_dagang": sertifikat_pl.nama_dagang,
                "izin_psat_pl": " ",
                "no_izin_psat_pl": def.no_izin_psat_pl,
                "berlaku_sampai": def.berlaku_sampai,
                "nama_latin": sertifikat_pl.nama_latin,
                "negara_asal": sertifikat_pl.negara_asal,
                "nama_merk": sertifikat_pl.nama_merek,
                "jenis_kemasan": sertifikat_pl.jenis_kemasan,
                "berat_bersih": sertifikat_pl.berat_bersih,
                "unit_penanganan": " ",
                "nama_unit_penanganan": unit_produksi.nama_unit,
                "alamat_unit_penanganan": unit_produksi.alamat_unit,
                "status_kepemilikan": unit_produksi.status_kepemilikan,
                "sppb_psat": " ",
                "no_sppb_psat": unit_produksi.sppb_psat_nomor,
                "level_sppb_psat": unit_produksi.level_sppb_psat,
                "berlaku_sampai_sppb_psat": unit_produksi.sppb_psat_masa_berlaku,
                "ruang_lingkup_sppb_psat": unit_produksi.ruang_lingkup,
                "kelas_mutu_sppb_psat": sertifikat_pl.kelas_mutu,
                "jenis_klaim_sppb_psat": sertifikat_pl.jenis_klaim,
                "desain_kemasan_sppb_psat": sertifikat_pl.desain_tabel_dan_kemasan

            }
            let filename = await 'sertifikat/psat-pl/' + sertifikat_pl.id_pengguna + '-' + sertifikat_pl.id_pengajuan + '-' + def.no_izin_psat_pl + '.pdf'
            const templatePath = Path.resolve('models', 'template_pdf', 'OSS_PL.html')

            const content = await ReadFile(templatePath, 'utf8')
                // compile and render the template with handlebars
            const template = Handlebars.compile(content)

            const pdf = await generatePdf.pdf(template(data), filename);

            let path_sertifikat = url + filename

            let data_pengajuan = [sertifikat_pl.id_pengajuan, sertifikat_pl.id_pengguna, sertifikat_pl.status_pengajuan, path_sertifikat, date];
            let pengajuan = await pool.query(
                'UPDATE ' + db_pengajuan_izin_edar +
                ' SET (final_sertifikat, update) = ($4, $5) WHERE id=$1 AND id_pengguna=$2 AND status_pengajuan=$3 ' +
                'RETURNING id, id_pengguna, status_pengajuan, status_proses, final_sertifikat', data_pengajuan);

            // res.set("Content-Type", "application/pdf");
            var pdfsToMerge = []
            pdfsToMerge.push(fs.readFileSync(filename))
            if (sertifikat_pl.desain_kemasan_sppb_psat != null) {
                pdfsToMerge.push(fs.readFileSync(sertifikat_pl.desain_kemasan_sppb_psat.replace('www/', '')))
            }
            console.log(sertifikat_pl.desain_kemasan_sppb_psat)

            if (sertifikat_pl.desain_label_sppb_psat != null) {
                pdfsToMerge.push(fs.readFileSync(sertifikat_pl.desain_label_sppb_psat.replace('www/', '')))
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
            res.status(200).json({
                message: "Sertifikat SPPB-PSAT",
                path: path_sertifikat,
                data: sertifikat_pl,
                pengajuan: unit_produksi
            });

            // } catch (e) {
            //     next(e.detail || e);
            // }
        };
        let fallback = (err) => {
            next(err);
        }
        authUtils.processRequestWithJWT(req, callback, fallback);
    }


}

module.exports = new generatePdfController();