const debug = require('debug')('app:controller:sppb_psat');
const authUtils = require('./utils/auth');
const summary = require('../models/summary');

class getSummary {
    async getSummarySPPB(req, res, next) {
        let callback = async() => {
            try {

                let detail = await summary.view_sppb();
                if (detail.status == '400') { res.status(400).json({ response: detail }); } else { res.status(200).json({ response: detail }); }
            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        }
        authUtils.processRequestWithJWT(req, callback, fallback);
    }
    async getSummaryIzinEdar(req, res, next) {
        let callback = async() => {
            try {

                let detail = await summary.view_izinedar();
                if (detail.status == '400') { res.status(400).json({ response: detail }); } else { res.status(200).json({ response: detail }); }
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

module.exports = new getSummary();