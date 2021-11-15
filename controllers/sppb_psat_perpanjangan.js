const debug = require('debug')('app:controller:sppb_psat');
const authUtils = require('./utils/auth');
const sppb_psat = require('../models/sppb_psat_perpanjangan.js');

class SppbPsatController {
    async perpanjangan_masa_berlaku(req, res, next) {
        let callback = async() => {
            try {
                let datas = req.body;
                debug('detail %o', datas);
                let detail = await sppb_psat.perpanjangan_masa_berlaku(datas);
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

    async update_perpanjangan_nomor_sppb_psat(req, res, next) {
        let callback = async() => {
            try {
                let datas = req.body;
                debug('detail %o', datas);
                let detail = await sppb_psat.update_perpanjangan_nomor_sppb_psat(datas);
                if (detail.status == '400') {res.status(400).json({ detail });}
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

    async get_perpanjangan_masa_berlaku(req, res, next) {
        let callback = async() => {
            try {
                let id = req.query.id;
                let user = req.query.user;
                debug('detail %o', id);
                let detail = await sppb_psat.get_perpanjangan_masa_berlaku(id, user);
                if (detail.status == '400') {res.status(400).json({ detail });}
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
}

module.exports = new SppbPsatController();