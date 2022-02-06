const debug = require('debug')('app:controller:oss');
const authUtils = require('./utils/auth');
const oss = require('../models/oss.js');


class OSSController {
    async generate_key(req, res, next) {
        let callback = async() => {
            try {
                let data = req.headers;
                debug('detail %o', data);
                let detail = await oss.generate_user_key('userinfo');
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
                let data = req.body;

                let detail_key = await oss.generate_user_key('userinfo');
                data.user_key = detail_key.user_key
                let detail = await oss.pelaku_usaha(data);

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
                let data = req.body;

                let detail_key = await oss.generate_user_key('validate');
                data.user_key = detail_key.user_key
                let detail = await oss.validate_token(data);

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
                let token = req.headers.Token;
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

                let detail_key = await oss.generate_user_key(body.nib);

                let detail = await oss.send_license(body, detail_key.user_key);

                if ((detail.OSS_result.responreceiveLicenseStatus.kode == 400)) {
                    res.status(400).json(detail);
                } else {
                    res.status(200).json(detail);
                }
            } catch (e) {

                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        };
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async send_license_status(req, res, next) {
        let callback = async() => {
            try {
                let body = req.body;

                let detail_key = await oss.generate_user_key(body.nib);

                let detail = await oss.send_license_status(body, detail_key.user_key);

                if ((detail.OSS_result.responreceiveLicenseStatus.kode == 400)) {
                    res.status(400).json(detail);
                } else {
                    res.status(200).json(detail);
                }
            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        };
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async send_fileDS(req, res, next) {
        let callback = async() => {
            try {
                let body = req.body;

                let detail_key = await oss.generate_user_key(body.receiveFileDS.nib);

                let detail = await oss.send_fileDS(body, detail_key.user_key);
                // if ((detail.OSS_result.responreceiveLicenseStatus.kode == 400)) {
                res.status(200).json(detail);
                // } else {
                //     res.status(200).json(detail);
                // }
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
}

module.exports = new OSSController();