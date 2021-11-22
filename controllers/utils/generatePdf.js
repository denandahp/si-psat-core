const puppeteer = require('puppeteer');
const Handlebars = require('handlebars')
const Fs = require('fs')
const Path = require('path')
const Util = require('util')
const ReadFile = Util.promisify(Fs.readFile)
const generatePdf = require("../../models/generatePdf.js")
const sppb_psat_view = require('../../models/sppb_psat_view.js')
const sppb_pl_view = require('../../models/sppb_pl_view.js')
const authUtils = require('../utils/auth');

// const url = 'stag.testing-nusantera.com/api/upload/view_pdf?path=/home/tstingnu/stagnusantera/'
const url = 'http://103.161.184.37:3000/api/upload_view_pdf?path=/home/si-psat-core/'
class generatePdfController {
    async sppb_psat(req, res, next) {
        let callback = async() => {
            try {
                const def = req.body
                const param = req.params
                const sertifikat_psat = await sppb_psat_view.view_sertifikat(param)

                let data = {

                    pbumku: "pbumku",
                    nama_unit_penanganan: sertifikat_psat.nama_perusahaan,
                    alamat_unit_penanganan: sertifikat_psat.alamat_perusahaan,
                    status_kepemilikan: sertifikat_psat.status_kepemilikan,
                    no_sppb_psat: def.no_sppb_psat,
                    level_sppb_psat: def.level,
                    ruang_lingkup: def.ruang_lingkup,
                    berlaku_sampai: def.masa_berlaku

                }
                let filename = await 'sertifikat/sppb-psat/' + sertifikat_psat.id_pengguna + '-' + sertifikat_psat.id_pengajuan + '-' + def.no_sppb_psat + '.pdf'
                const templatePath = Path.resolve('models', 'template_pdf', 'OSS_SPPB_PSAT.html')

                const content = await ReadFile(templatePath, 'utf8')
                    // compile and render the template with handlebars
                const template = Handlebars.compile(content)

                const pdf = await generatePdf.pdf(template(data), filename);

                // res.set("Content-Type", "application/pdf");

                res.status(200).json({
                    message: "Sertifikat SPPB-PSAT",
                    path: url + filename,
                    data: data
                });


            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        }
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async psat_pl(req, res, next) {
        let callback = async() => {
            try {
                const def = req.body
                const param = req.params
                const sertifikat_pl = await sppb_pl_view.view_sertifikat(param)
                let data = {

                        "pbumku": "pbumku",
                        "nama_psat": "nama_psat",
                        "jenis_psat": "jenis_psat",
                        "nama_dagang": "nama_dagang",
                        "izin_psat_pl": "izin_psat_pl",
                        "no_izin_psat_pl": "no_izin_psat_pl",
                        "berlaku_sampai": "berlaku_sampai",
                        "nama_latin": "nama_latin",
                        "negara_asal": "negara_asal",
                        "nama_merk": "nama_merk",
                        "jenis_kemasan": "jenis_kemasan",
                        "berat_bersih": "berat_bersih",
                        "unit_penanganan": "unit_penanganan",
                        "nama_unit_penanganan": "nama_unit_penanganan",
                        "alamat_unit_penanganan": "alamat_unit_penanganan",
                        "status_kepemilikan": "status_kepemilikan",
                        "sppb_psat": "sppb_psat",
                        "no_sppb_psat": "no_sppb_psat",
                        "level_sppb_psat": sertifikat_pl.level,
                        "berlaku_sampai_sppb_psat": "berlaku_sampai_sppb_psat",
                        "ruang_lingkup_sppb_psat": sertifikat_pl.ruang_lingkup,
                        "kelas_mutu_sppb_psat": "kelas_mutu_sppb_psat",
                        "jenis_klaim_sppb_psat": "jenis_klaim_sppb_psat",
                        "desain_kemasan_sppb_psat": "desain_kemasan_sppb_psat",
                        "desain_label_sppb_psat": "desain_label_sppb_psat"

                    }
                    // const templatePath = Path.resolve('models', 'template_pdf', 'OSS_PL.html')
                    // const content = await ReadFile(templatePath, 'utf8')

                // // compile and render the template with handlebars
                // const template = Handlebars.compile(content)

                // const pdf = await generatePdf.pdf(template(data));
                // res.set("Content-Type", "application/pdf");
                // res.status(200).send(pdf);

            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        }
        authUtils.processRequestWithJWT(req, callback, fallback);
    }


}

module.exports = new generatePdfController();