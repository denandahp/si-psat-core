const debug = require('debug')('app:controller:sppb_psat');
const authUtils = require('../../controllers/utils/auth.js');
const core = require('../core.js')
const model = require('./models.js');

class OkkpRatingsController {
    async create_ratings(req, res, next) {
        let callback = async() => {
            try {
                let requset_body = req.body;
                let response = await model.create_ratings(requset_body);
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

    async update_ratings(req, res, next) {
        let callback = async() => {
            try {
                let requset_body = req.body;
                debug('detail %o', requset_body);
                let response = await model.update_ratings(requset_body);
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

    async delete_ratings(req, res, next) {
        let callback = async() => {
            try {
                let rating_id = req.query.rating_id;
                let response = await model.delete_ratings(rating_id);
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

    async index_ratings(req, res, next) {
        let callback = async() => {
            try {
                let parameter = {
                    page : req.query.page,
                    limit : req.query.limit,
                    start : req.query.start,
                    end : req.query.end
                }
                let response = await model.index_ratings(parameter);
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

    async detail_ratings(req, res, next) {
        let callback = async() => {
            try {
                let rating_id = req.query.rating_id;
                let response = await model.detail_ratings(rating_id);
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

module.exports = new OkkpRatingsController();