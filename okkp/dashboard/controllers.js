const authUtils = require('../../controllers/utils/auth.js');
const core = require('../core.js')
const model = require('./models.js');

class DashboardController {
    async statistik_registrasi(req, res, next) {
        let callback = async() => {
            try {
                let param = {
                    provinsi_id : req.query.provinsi,
                    start_date : req.query.start,
                    end_date : req.query.end,
                    start_terbit : req.query.start_terbit,
                    end_terbit : req.query.end_terbit                    
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

    async statistik_registrasi_by_year(req, res, next) {
        let callback = async() => {
            try {
                let year = req.params.year
                let back_year = req.query.back_year
                let response = await model.statistik_registrasi_by_year(year, back_year);
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
                    jenis_registrasi_id : req.query.jenis_registrasi,
                    start_date : req.query.start,
                    end_date : req.query.end,
                    start_terbit : req.query.start_terbit,
                    end_terbit : req.query.end_terbit
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
                    provinsi_id : req.query.provinsi,
                    start_date : req.query.start,
                    end_date : req.query.end,
                    start_terbit : req.query.start_terbit,
                    end_terbit : req.query.end_terbit
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

    async statistik_uji_lab(req, res, next) {
        let callback = async() => {
            try {
                let param = {
                    start_date : req.query.start,
                    end_date : req.query.end,
                }
                let response = await model.statistik_uji_lab(param);
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

    async statistik_uji_lab_by_provinsi(req, res, next) {
        let callback = async() => {
            try {
                let param = {
                    year : req.query.year,
                    month : req.query.month,
                    jenis_uji_lab : req.query.jenis_uji_lab,
                }
                let response = await model.statistik_uji_lab_by_provinsi(param);
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

    async statistik_rapid_test(req, res, next) {
        let callback = async() => {
            try {
                let param = {
                    start_date : req.query.start,
                    end_date : req.query.end,
                }
                let response = await model.statistik_rapid_test(param);
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

    async statistik_rapid_test_by_provins(req, res, next) {
        let callback = async() => {
            try {
                let param = {
                    year : req.query.year,
                    month : req.query.month,
                    jenis_rapid_test : req.query.jenis_rapid_test,
                }
                let response = await model.statistik_rapid_test_by_provins(param);
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