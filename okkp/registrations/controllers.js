const debug = require('debug')('app:controller:sppb_psat');
const authUtils = require('../../controllers/utils/auth.js');
const model = require('./models.js');

class OkkpRegistrationsController {
    async create_registrations(req, res, next) {
        let callback = async() => {
            try {
                let requset_body = req.body;
                let user = req.user.data.data;
                debug('detail %o', requset_body);
                let response = await model.create_registrations(requset_body, user);
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

    async update_registrations(req, res, next) {
        let callback = async() => {
            try {
                let requset_body = req.body;
                let user = req.user.data.data;
                debug('detail %o', requset_body);
                let response = await model.update_registrations(requset_body, user);
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

module.exports = new OkkpRegistrationsController();