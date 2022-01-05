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

const sppbGenerator = require('./sppbGenerator')
const authUtils = require('../utils/auth');
const PDFMerge = require('pdf-merge');
const PDFDocument = require('pdf-lib').PDFDocument;
const { query } = require('../../libs/db');
const izinedarGenerator = require('./izinedarGenerator');

const url = '/root/si-psat-core/'

const db_pengajuan_sppb_psat = 'sppb_psat.sertifikat_psat';
const db_perusahaan_sppb_psat = 'sppb_psat.info_perusahaan';
const db_pengajuan_izin_edar = 'izin_edar.pengajuan';


var date = new Date(Date.now());
date.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
class generatePdfController {


    async sppb_psat(req, res, next) {
        let callback = async() => {
            try {
                const def = req.body
                const param = req.params
                const type = req.query.type

                const sertifikat_psat = await sppb_psat_view.view_sertifikat(param)
                let result
                if (type == 'PENGALIHAN') {
                    result = await sppbGenerator.sppb_pengalihan(sertifikat_psat, def, req.method)
                    res.status(200).json(result)
                } else {
                    result = await sppbGenerator.sppb_permohonan(sertifikat_psat, def, req.method)
                    res.status(200).json(result)
                }

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
            //try {
            const def = req.body
            const param = req.params
            const type = req.query.type
            let sertifikat_pl = await sppb_pl_view.view_sertifikat(param)
            let unit_produksi = await sppb_pl_view.view_unitproduksi(param)
            let result;
            if (type == 'PERMOHONAN') {
                result = await izinedarGenerator.permohonan(sertifikat_pl, unit_produksi, def, req.method)
                res.status(200).json(result)
            } else if (type == 'PERUBAHAN') {
                result = await izinedarGenerator.perubahandata(sertifikat_pl, unit_produksi, def, req.method)
                res.status(200).json(result)
            } else {
                result = await izinedarGenerator.permohonan(sertifikat_pl, unit_produksi, def, req.method)
                res.status(200).json(result)
            }

            //} catch (e) {
            //    next(e.detail || e);
            //}
        };
        let fallback = (err) => {
            next(err);
        }
        authUtils.processRequestWithJWT(req, callback, fallback);
    }


}

module.exports = new generatePdfController();