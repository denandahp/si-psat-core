const debug = require('debug')('app:controller:sppb_psat');
const authUtils = require('../../controllers/utils/auth.js');
const core = require('../core.js')
const model = require('./models.js');

class OkkpRegistrationsController {
    async create_registrations(req, res, next) {
        let callback = async() => {
            try {
                let requset_body = req.body;
                let user = req.user.data.data;
                debug('detail %o', requset_body);
                let response = await model.create_registrations(requset_body, user);
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

    async update_registrations(req, res, next) {
        let callback = async() => {
            try {
                let requset_body = req.body;
                let user = req.user.data.data;
                debug('detail %o', requset_body);
                let response = await model.update_registrations(requset_body, user);
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

    async index_registrasi(req, res, next) {
        let callback = async() => {
            try {
                let parameter = {
                    page : req.query.page,
                    limit : req.query.limit,
                    reg : req.query.reg,
                    provinsi : req.query.provinsi,
                    no_reg : core.default_dict(req.query.no_reg, ''),
                    usaha : core.default_dict(req.query.usaha, '')
                }
                let response = await model.index_registrasi(parameter);
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

    async index_sertifikasi(req, res, next) {
        let callback = async() => {
            try {
                let parameter = {
                    page : req.query.page,
                    limit : req.query.limit,
                    sertif : req.query.sertif,
                    provinsi : req.query.provinsi,
                    no_sertif : core.default_dict(req.query.no_sertif, ''),
                    usaha : core.default_dict(req.query.usaha, '')
                }
                let response = await model.index_sertifikasi(parameter);
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

module.exports = new OkkpRegistrationsController();