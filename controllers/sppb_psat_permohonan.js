const debug = require('debug')('app:controller:sppb_psat');
const authUtils = require('./utils/auth');
const sppb_psat = require('../models/sppb_psat_permohonan.js');

class SppbPsatController {
    async permohonan_awal(req, res, next) {
        let callback = async() => {
            try {
                let datas = req.body;
                debug('detail %o', datas);
                let detail = await sppb_psat.permohonan_awal(datas);
                if (detail.status == '400') {res.status(400).json({ response: detail });}
                else { res.status(200).json({ response: detail });}
            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        }
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async unit_produksi(req, res, next) {
        let callback = async() => {
            try {
                let datas = req.body;
                debug('detail %o', datas);
                let detail = await sppb_psat.unit_produksi(datas);
                if (!detail == '400') {res.status(400).json({ detail });}
                else { res.status(200).json({ detail });}
            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        }
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async ruang_lingkup(req, res, next) {
        let callback = async() => {
            try {
                let datas = req.body;
                debug('detail %o', datas);
                let detail = await sppb_psat.ruang_lingkup(datas);
                if (detail.status == '400') {res.status(400).json({ response: detail });}
                else { res.status(200).json({ response: detail });}
            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        }
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async update_unit_produksi(req, res, next) {
        let callback = async() => {
            try {
                let datas = req.body;
                debug('detail %o', datas);
                let detail = await sppb_psat.update_unit_produksi(datas);
                if (!detail == '400') {res.status(400).json({ detail });}
                else { res.status(200).json({ detail });}
            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        }
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async update_ruang_lingkup(req, res, next) {
        let callback = async() => {
            try {
                let datas = req.body;
                debug('detail %o', datas);
                let detail = await sppb_psat.update_ruang_lingkup(datas);
                if (detail.status == '400') {res.status(400).json({ response: detail });}
                else { res.status(200).json({ response: detail });}
            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        }
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async delete_unit_produksi(req, res, next) {
        let callback = async() => {
            try {
                let id = req.query.id;
                debug('detail %o', id);
                let detail = await sppb_psat.delete_unit_produksi(id);
                if (!detail == '400') {res.status(400).json({ detail });}
                else { res.status(200).json({ detail });}
            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        }
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async delete_ruang_lingkup(req, res, next) {
        let callback = async() => {
            try {
                let id = req.query.id;
                debug('detail %o', id);
                let detail = await sppb_psat.delete_ruang_lingkup(id);
                if (detail.status == '400') {res.status(400).json({ response: detail });}
                else { res.status(200).json({ response: detail });}
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

module.exports = new SppbPsatController();