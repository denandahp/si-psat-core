const debug = require('debug')('app:controller:sppb_psat');
const authUtils = require('./utils/auth');
const summary = require('../models/summary');
const fs = require('fs')
var path = require('path');
const express = require('express');
const app = express();

class getSummary {
    async getSummarySPPB(req, res, next) {
        let callback = async() => {
            try {
                let detail;
                detail = await summary.view_sppb(req.params.year, req.params.month, req.params.jenis, false);
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
                detail = await summary.view_izinedar(req.params.year, req.params.month, req.params.jenis, false);

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

    async downloadExcel(req, res, next) {
        let filename = req.params.filename;
        let jenis = req.params.jenis;
        let year = req.params.year;
        let month = req.params.month;
        try {

            let detail;
            let filePath;

            if (filename == 'sppb-psat') {
                detail = await summary.view_sppb(year, month, jenis, true);
                filePath = 'summary/sppb-psat-' + jenis + '-' + year + '-' + month + '.xlsx';
            } else if (filename == 'izin-edar') {
                detail = await summary.view_izinedar(year, month, jenis, true);
                filePath = 'summary/izin-edar-' + jenis + '-' + year + '-' + month + '.xlsx';
            }
            let readFile = filePath.split('/')
            var file = fs.createReadStream(filePath);
            var stat = fs.statSync(filePath);
            res.setHeader('Content-Length', stat.size);
            res.setHeader('Content-Type', 'application/xlsx');
            res.setHeader('Content-Disposition', `attachment; filename=${readFile[readFile.length-1]}`);
            file.pipe(res);

        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    }

}

module.exports = new getSummary();