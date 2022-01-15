const debug = require('debug')('app:controller:notifikasi');
const authUtils = require('./utils/auth');
const notifikasi = require('../models/notifikasi.js');

class NotifikasiController {
    async read_notifikasi(req, res, next) {
        let callback = async() => {
            try {
                let datas = req.body;
                debug('detail %o', datas);
                let detail = await notifikasi.read_notifikasi(datas);
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

    async history_notifikasi(req, res, next) {
        let callback = async() => {
            try {
                let user = req.query.user;
                let page = req.query.page;
                let limit = req.query.limit;
                debug('detail %o', user);
                let detail = await notifikasi.history_notifikasi(user, page, limit);
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

module.exports = new NotifikasiController();