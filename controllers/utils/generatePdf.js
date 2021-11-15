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
                    no_sppb_psat: def.nomor_sppb_psat_baru,
                    level_sppb_psat: def.level,
                    ruang_lingkup: def.ruang_lingkup,
                    berlaku_sampai: def.masa_berlaku

                }
                const templatePath = Path.resolve('models', 'template_pdf', 'OSS_SPPB_PSAT.html')

                const content = await ReadFile(templatePath, 'utf8')
                    // compile and render the template with handlebars
                const template = Handlebars.compile(content)

                const pdf = await generatePdf.pdf(template(data));
                await response.data.pipe(fs.createWriteStream('invoice.pdf'));

                res.set("Content-Type", "application/pdf");

                res.status(200).send(pdf);


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
                res.send(sertifikat_pl)
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