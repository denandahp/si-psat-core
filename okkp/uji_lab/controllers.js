const authUtils = require('../../controllers/utils/auth.js');
const core = require('../core.js')
const model = require('./models.js');

class OkkpUjiLabController {
    async create_uji_lab(req, res, next) {
        let callback = async() => {
            try {
                let requset_body = req.body;
                let user = req.user.data.data;
                let response = await model.create_uji_lab(requset_body, user);
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

    async update_uji_lab(req, res, next) {
        let callback = async() => {
            try {
                let requset_body = req.body;
                let user = req.user.data.data;
                let response = await model.update_uji_lab(requset_body, user);
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

    async delete_uji_lab(req, res, next) {
        let callback = async() => {
            try {
                let uji_lab_id = req.query.uji_lab_id;
                let response = await model.delete_uji_lab(uji_lab_id);
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

    async index_uji_lab(req, res, next) {
        let callback = async() => {
            try {
                let parameter = {
                    page : req.query.page,
                    limit : req.query.limit,
                    uji_lab_id: req.query.uji_lab_id,
                    jenis_uji_lab_id: req.query.jenis_uji_lab_id,
                    start_date : req.query.start,
                    end_date : req.query.end
                }
                let response = await model.index_uji_lab(parameter);
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

    async detail_uji_lab(req, res, next) {
        let callback = async() => {
            try {
                let uji_lab_id = req.query.uji_lab_id;
                let response = await model.detail_uji_lab(uji_lab_id);
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

module.exports = new OkkpUjiLabController();