const debug = require('debug')('app:controller:sppb_psat');
const authUtils = require('./utils/auth');
const summary = require('../models/summary');

class getSummary {
    async getSummarySPPB(req, res, next) {
        let callback = async() => {
            try {
                let detail;
                if (req.params.jenis == 'ongoing') {
                    detail = await summary.view_sppb(req.params.year, req.params.month);
                } else {
                    detail = await summary.view_sppb_finish(req.params.year, req.params.month);
                }

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
                let detail;
                if (req.params.jenis == 'ongoing') {
                    detail = await summary.view_izinedar(req.params.year, req.params.month);
                } else {
                    detail = await summary.view_izinedar_finish(req.params.year, req.params.month)
                }
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
    async getPermohonanByGraph(req, res, next) {
        let callback = async() => {
            try {
                let year = req.params.year
                let detail = await summary.total_by_graph(year);
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