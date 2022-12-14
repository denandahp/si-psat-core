const debug = require('debug')('app:controller:sppb_psat');
const authUtils = require('../../controllers/utils/auth.js');
const core = require('../core.js')
const model = require('./models.js');

class OkkpRegistrationsController {
    async create_registrations(req, res, next) {
        let callback = async() => {
            try {
                let requset_body = req.body;
                let user = req.user.data.data;
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

    async delete_registrations(req, res, next) {
        let callback = async() => {
            try {
                let registrasi_id = req.query.registrasi_id;
                let response = await model.delete_registrations(registrasi_id);
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

    async index_registrasi(req, res, next) {
        let callback = async() => {
            try {
                let user = req.user ? req.user.data.data : 'public';
                let provinsi = req.query.provinsi;
                let is_superadmin = core.is_superadmin(user)
                if(is_superadmin || user == 'public'){
                    provinsi = req.query.provinsi
                }else{
                    provinsi = user.provinsi_id;
                }
                let parameter = {
                    page : req.query.page,
                    limit : req.query.limit,
                    reg : req.query.reg,
                    provinsi : provinsi,
                    no_reg : core.default_dict(req.query.no_reg, ''),
                    usaha : core.default_dict(req.query.usaha, ''),
                    id_sertif: req.query.id_sertif,
                    start_date : req.query.start,
                    end_date : req.query.end,
                    start_terbit : req.query.start_terbit,
                    end_terbit : req.query.end_terbit

                }
                let response = await model.index_registrasi(parameter);
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

    async index_sertifikasi(req, res, next) {
        let callback = async() => {
            try {
                let parameter = {
                    page : req.query.page,
                    limit : req.query.limit,
                    sertif : req.query.sertif,
                    provinsi : req.query.provinsi,
                    no_sertif : core.default_dict(req.query.no_sertif, ''),
                    usaha : core.default_dict(req.query.usaha, '')
                }
                let response = await model.index_sertifikasi(parameter);
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

    async detail_registrations(req, res, next) {
        let callback = async() => {
            try {
                let registrasi_id = req.query.registrasi_id;
                let response = await model.detail_registrations(registrasi_id);
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