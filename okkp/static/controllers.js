const debug = require('debug')('app:controller:sppb_psat');
const authUtils = require('../../controllers/utils/auth.js');
const model = require('./models.js');

class StaticController {
    async index_komoditas(req, res, next) {
        let callback = async() => {
            try {
                let response = await model.index_komoditas();
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

module.exports = new StaticController();