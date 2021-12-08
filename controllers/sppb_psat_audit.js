const debug = require('debug')('app:controller:sppb_psat_audit');
const authUtils = require('./utils/auth');
const audit = require('../models/sppb_psat_audit.js');


class AuditDokumenController {
    async penunjukkan_auditor(req, res, next) {
        let callback = async() => {
            try {
                let query = req.body;
                debug('detail %o', query);
                let detail = await audit.penunjukkan_auditor(query);
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

    async audit_dokumen(req, res, next) {
        let callback = async() => {
            try {
                let query = req.body;
                debug('detail %o', query);
                let detail = await audit.audit_dokumen(query);
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

    async audit_lapang(req, res, next) {
        let callback = async() => {
            try {
                let query = req.body;
                debug('detail %o', query);
                let detail = await audit.audit_lapang(query);
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

    async penunjukkan_tim_komtek(req, res, next) {
        let callback = async() => {
            try {
                let query = req.body;
                debug('detail %o', query);
                let detail = await audit.penunjukkan_tim_komtek(query);
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

    async audit_rekomendasi(req, res, next) {
        let callback = async() => {
            try {
                let query = req.body;
                debug('detail %o', query);
                let detail = await audit.audit_rekomendasi(query);
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

    async audit_history(req, res, next) {
        let callback = async() => {
            try {
                let id_pengajuan = req.query.id;
                debug('detail %o', id_pengajuan);
                let detail = await audit.audit_history(id_pengajuan);
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

    async history_pengajuan_sppb_psat(req, res, next) {
        let callback = async() => {
            try {
                let user = req.query.user;
                let code_proses = req.query.code;
                let role = req.query.role;
                debug('detail %o', user);
                let detail = await audit.history_pengajuan_sppb_psat(user, code_proses, role);
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

module.exports = new AuditDokumenController();