const authUtils = require('../../controllers/utils/auth.js');
const model = require('./models.js');

class OkkpRapidTestController {
    async create_rapid_test(req, res, next) {
        let callback = async() => {
            try {
                let requset_body = req.body;
                let user = req.user.data.data;
                let response = await model.create_rapid_test(requset_body, user);
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

    async update_rapid_test(req, res, next) {
        let callback = async() => {
            try {
                let requset_body = req.body;
                let user = req.user.data.data;
                let response = await model.update_rapid_test(requset_body, user);
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

    async delete_rapid_test(req, res, next) {
        let callback = async() => {
            try {
                let rapid_test_id = req.query.rapid_test_id;
                let response = await model.delete_rapid_test(rapid_test_id);
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

    async index_rapid_test(req, res, next) {
        let callback = async() => {
            try {
                let parameter = {
                    page : req.query.page,
                    limit : req.query.limit,
                    rapid_test_id: req.query.rapid_test_id,
                    jenis_rapid_test_id: req.query.jenis_rapid_test_id,
                    start_date : req.query.start,
                    end_date : req.query.end
                }
                let response = await model.index_rapid_test(parameter);
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

    async detail_rapid_test(req, res, next) {
        let callback = async() => {
            try {
                let rapid_test_id = req.query.rapid_test_id;
                let response = await model.detail_rapid_test(rapid_test_id);
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

module.exports = new OkkpRapidTestController();