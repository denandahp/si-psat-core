const debug = require('debug')('app:controller:oss');
const authUtils = require('./utils/auth');
const oss = require('../models/oss.js');


class OSSController {
    async generate_key(req, res, next) {
        let callback = async() => {
            try {
                let data = req.headers;
                let type = req.headers.type;
                debug('detail %o', data);
                let detail = await oss.generate_user_key(type);
                if (detail.status == '400') { res.status(400).json({ detail }); } else { res.status(200).json({ response: 200, data: detail }); }
            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        };
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async pelaku_usaha(req, res, next) {
        let callback = async() => {
            try {
                let data =  req.query;
                let access_token = req.headers.authorization.split('Bearer ')[1];
                let detail = await oss.pelaku_usaha(data, access_token);
                if (detail.status == '400') { res.status(400).json({ detail }); } else { res.status(200).json({ response: 200, data: detail }); }
            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        };
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async validate_token(req, res, next) {
        let callback = async() => {
            try {
                let data =  req.query;
                let access_token = req.headers.authorization.split('Bearer ')[1];
                let detail = await oss.validate_token(data, access_token);

                if (detail.status == '400') { res.status(400).json({ detail }); } else { res.status(200).json({ response: 200, data: detail }); }
            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        };
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async receive_nib(req, res, next) {
        let callback = async() => {
            try {
                let data = req.body;
                let token = req.query.token;
                debug('detail %o', data);
                let detail = await oss.receive_nib(data, token);
                if (detail.status == '400') { res.status(400).json({ detail }); } else { res.status(200).json({ responreceiveNIB: detail }); }
            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        };
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async send_license(req, res, next) {
        let callback = async() => {
            try {
                let body = req.body;
                let user_key = req.headers.user_key;
                debug('detail %o', body);
                let detail = await oss.send_license(body, user_key);
                if (detail.status == '400') { res.status(400).json({ detail }); } else { res.status(200).json({ responreceiveLicense: detail }); }
            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        };
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async send_license_final(req, res, next) {
        let callback = async() => {
            try {
                let body = req.body;
                let user_key = req.headers.user_key;
                debug('detail %o', body);
                let detail = await oss.send_license_final(body, user_key);
                if (detail.status == '400') { res.status(400).json({ detail }); } else { res.status(200).json({ responreceiveNIB: detail }); }
            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        };
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async get_list_izin_oss(req, res, next) {
        let callback = async() => {
            try {
                let no_identitas = req.query.no_identitas;
                let kode_izin = req.query.kode_izin;
                debug('detail %o', no_identitas);
                let detail = await oss.get_list_izin_oss(no_identitas, kode_izin);
                if (detail.status == '400') { res.status(400).json({ detail }); } else { res.status(200).json({ detail }); }
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

module.exports = new OSSController();