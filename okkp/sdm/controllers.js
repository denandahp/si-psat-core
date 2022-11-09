const debug = require('debug')('app:controller:sppb_psat');
const authUtils = require('../../controllers/utils/auth.js');
const core = require('../core.js')
const model = require('./models.js');

class OkkpSDMController {
    async create_sdm(req, res, next) {
        let callback = async() => {
            try {
                let requset_body = req.body;
                let user = req.user.data.data;
                let response = await model.create_sdm(requset_body, user);
                core.response(res, response)
            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        }
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async update_sdm(req, res, next) {
        let callback = async() => {
            try {
                let requset_body = req.body;
                let user = req.user.data.data;
                let response = await model.update_sdm(requset_body, user);
                core.response(res, response)
            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        }
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async delete_sdm(req, res, next) {
        let callback = async() => {
            try {
                let sdm_id = req.query.sdm_id;
                let response = await model.delete_sdm(sdm_id);
                core.response(res, response)
            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        }
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async index_sdm(req, res, next) {
        let callback = async() => {
            try {
                let parameter = {
                    page : req.query.page,
                    limit : req.query.limit,
                    start : req.query.start,
                    end : req.query.end
                }
                let response = await model.index_sdm(parameter);
                core.response(res, response)
            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        }
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async detail_sdm(req, res, next) {
        let callback = async() => {
            try {
                let sdm_id = req.query.sdm_id;
                let response = await model.detail_sdm(sdm_id);
                core.response(res, response)
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

module.exports = new OkkpSDMController();