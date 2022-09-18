const debug = require('debug')('app:controller:sppb_psat');
const authUtils = require('../../controllers/utils/auth.js');
const model = require('./models.js');

class StaticController {
    // ----------------------- CRUD KOMODITAS ----------------------------
    async create_komoditas(req, res, next) {
        let callback = async() => {
            try {
                let requset_body = req.body;
                let response = await model.create_komoditas(requset_body);
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

    async update_komoditas(req, res, next) {
        let callback = async() => {
            try {
                let requset_body = req.body;
                let response = await model.update_komoditas(requset_body);
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

    async delete_komoditas(req, res, next) {
        let callback = async() => {
            try {
                let id = req.query.id;
                let response = await model.delete_komoditas(id);
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

    // ----------------------- CRUD JENIS REGISTRASI ----------------------------
    async create_jenis_registrasi(req, res, next) {
        let callback = async() => {
            try {
                let requset_body = req.body;
                let response = await model.create_jenis_registrasi(requset_body);
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

    async update_jenis_registrasi(req, res, next) {
        let callback = async() => {
            try {
                let requset_body = req.body;
                let response = await model.update_jenis_registrasi(requset_body);
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

    async delete_jenis_registrasi(req, res, next) {
        let callback = async() => {
            try {
                let id = req.query.id;
                let response = await model.delete_jenis_registrasi(id);
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

    async index_jenis_registrasi(req, res, next) {
        let callback = async() => {
            try {
                let response = await model.index_jenis_registrasi();
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

    // ----------------------- CRUD JENIS SERTIFIKAT ----------------------------
    async create_jenis_sertifikat(req, res, next) {
        let callback = async() => {
            try {
                let requset_body = req.body;
                let response = await model.create_jenis_sertifikat(requset_body);
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

    async update_jenis_sertifikat(req, res, next) {
        let callback = async() => {
            try {
                let requset_body = req.body;
                let response = await model.update_jenis_sertifikat(requset_body);
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

    async delete_jenis_sertifikat(req, res, next) {
        let callback = async() => {
            try {
                let id = req.query.id;
                let response = await model.delete_jenis_sertifikat(id);
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

    async index_jenis_sertifikat(req, res, next) {
        let callback = async() => {
            try {
                let response = await model.index_jenis_sertifikat();
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

    // ----------------------- CRUD STATUS ----------------------------
    async index_status(req, res, next) {
        let callback = async() => {
            try {
                let response = await model.index_status();
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

    // ----------------------- CRUD JENIS HC ----------------------------
    async create_jenis_hc(req, res, next) {
        let callback = async() => {
            try {
                let requset_body = req.body;
                let response = await model.create_jenis_hc(requset_body);
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

    async update_jenis_hc(req, res, next) {
        let callback = async() => {
            try {
                let requset_body = req.body;
                let response = await model.update_jenis_hc(requset_body);
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

    async delete_jenis_hc(req, res, next) {
        let callback = async() => {
            try {
                let id = req.query.id;
                let response = await model.delete_jenis_hc(id);
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

    async index_jenis_hc(req, res, next) {
        let callback = async() => {
            try {
                let response = await model.index_jenis_hc();
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

    // ----------------------- CRUD PROVINSI ----------------------------
    async index_provinsi(req, res, next) {
        let callback = async() => {
            try {
                let response = await model.index_provinsi();
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

    async sync_data(req, res, next) {
        let callback = async() => {
            try {
                let response = await model.sync_data();
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