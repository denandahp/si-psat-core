const sppb_psat_view = require('../../models/sppb_psat_view.js')
const sppb_pl_view = require('../../models/sppb_pl_view.js')
const sppbGenerator = require('./sppbGenerator')

const izinedarGenerator = require('./izinedarGenerator');
const authUtils = require('../utils/auth');



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
                let unit_produksi = await sppb_psat_view.view_unitproduksi(sertifikat_psat.unit_produksi)
                let result;
                if (type == 'PENGALIHAN') {
                    result = await sppbGenerator.sppb_pengalihan(sertifikat_psat, unit_produksi, def, req.method)
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
            try {
                const def = req.body
                const param = req.params
                const type = req.query.type
                let sertifikat_pl = await sppb_pl_view.view_sertifikat(param)
                let unit_produksi = await sppb_pl_view.view_unitproduksi(sertifikat_pl.unit_produksi)
                let result;
                if (type == 'PERMOHONAN') {
                    result = await izinedarGenerator.permohonan(sertifikat_pl, unit_produksi, def, req.method)
                    res.status(200).json(result)
                } else if (type == 'PERUBAHAN') {
                    result = await izinedarGenerator.perubahandata(sertifikat_pl, unit_produksi, def, req.method)
                    res.status(200).json(result)
                } else {
                    result = await izinedarGenerator.pengalihan(sertifikat_pl, unit_produksi, def, req.method)
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


}

module.exports = new generatePdfController();