const authUtils = require('../../controllers/utils/auth.js');
const core = require('../core.js')
const model = require('./models.js');

class DashboardController {
    async statistik_registrasi(req, res, next) {
        let callback = async() => {
            try {
                let param = {
                    provinsi_id : req.query.provinsi
                }
                let response = await model.statistik_registrasi(param);
                if (response.status == '400') {res.status(400).json({ response });}
                else { res.status(200).json({ response });}
            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        }
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async registrasi_by_provinsi(req, res, next) {
        let callback = async() => {
            try {
                let param = {
                    provinsi_id : req.query.provinsi,
                    unit_usaha : req.query.unit_usaha,
                    jenis_registrasi_id : req.query.jenis_registrasi
                }
                let response = await model.registrasi_by_provinsi(param);
                if (response.status == '400') {res.status(400).json({ response });}
                else { res.status(200).json({ response });}
            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        }
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async komoditas(req, res, next) {
        let callback = async() => {
            try {
                let param = {
                    provinsi_id : req.query.provinsi
                }
                let response = await model.komoditas(param);
                if (response.status == '400') {res.status(400).json({ response });}
                else { res.status(200).json({ response });}
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

module.exports = new DashboardController();