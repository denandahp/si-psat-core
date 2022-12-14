const debug = require('debug')('app:controller:psat_pl_permohonan');
const authUtils = require('./utils/auth');
const psat_pl = require('../models/psat_pl_permohonan.js');


class PsatPlPermohonanController {
    //Permohonan izin edar PSAT PL/perpanjangan izin edar PSAT PL ----------------
    async permohonan_izin(req, res, next) {
        let callback = async() => {
            try {
                let query = req.body;
                debug('detail %o', query);
                let detail = await psat_pl.permohonan_izin(query);
                if (detail.status == '400') { res.status(400).json({ detail }); } else { res.status(200).json({ detail }); }
            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        }
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async add_unit_produksi(req, res, next) {
        let callback = async() => {
            try {
                let query = req.body;
                debug('detail %o', query);
                let detail = await psat_pl.add_unit_produksi(query);
                if (detail.status == '400') { res.status(400).json({ detail }); } else { res.status(200).json({ detail }); }
            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        }
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async add_daftar_pemasok(req, res, next) {
        let callback = async() => {
            try {
                let query = req.body;
                debug('detail %o', query);
                let detail = await psat_pl.add_daftar_pemasok(query);
                if (detail.status == '400') { res.status(400).json({ detail }); } else { res.status(200).json({ detail }); }
            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        }
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async add_daftar_pelanggan(req, res, next) {
        let callback = async() => {
            try {
                let query = req.body;
                debug('detail %o', query);
                let detail = await psat_pl.add_daftar_pelanggan(query);
                if (detail.status == '400') { res.status(400).json({ detail }); } else { res.status(200).json({ detail }); }
            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        }
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async add_info_produk(req, res, next) {
        let callback = async() => {
            try {
                let query = req.body;
                debug('detail %o', query);
                let detail = await psat_pl.add_info_produk(query);
                if (detail.status == '400') { res.status(400).json({ detail }); } else { res.status(200).json({ detail }); }
            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        }
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async update_nomor_izin_edar_pl(req, res, next) {
        let callback = async() => {
            try {
                let datas = req.body;
                debug('detail %o', datas);
                let detail = await psat_pl.update_nomor_izin_edar_pl(datas);
                if (detail.status == '400') { res.status(400).json({ detail }); } else { res.status(200).json({ detail }); }
            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        }
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async update_permohonan_izin(req, res, next) {
        let callback = async() => {
            try {
                let query = req.body;
                debug('detail %o', query);
                let detail = await psat_pl.update_permohonan_izin(query);
                if (detail.status == '400') { res.status(400).json({ detail }); } else { res.status(200).json({ detail }); }
            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        }
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async update_unit_produksi(req, res, next) {
        let callback = async() => {
            try {
                let query = req.body;
                debug('detail %o', query);
                let detail = await psat_pl.update_unit_produksi(query);
                if (detail.status == '400') { res.status(400).json({ detail }); } else { res.status(200).json({ detail }); }
            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        }
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async update_daftar_pemasok(req, res, next) {
        let callback = async() => {
            try {
                let query = req.body;
                debug('detail %o', query);
                let detail = await psat_pl.update_daftar_pemasok(query);
                if (detail.status == '400') { res.status(400).json({ detail }); } else { res.status(200).json({ detail }); }
            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        }
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async update_daftar_pelanggan(req, res, next) {
        let callback = async() => {
            try {
                let query = req.body;
                debug('detail %o', query);
                let detail = await psat_pl.update_daftar_pelanggan(query);
                if (detail.status == '400') { res.status(400).json({ detail }); } else { res.status(200).json({ detail }); }
            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        }
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async update_info_produk(req, res, next) {
        let callback = async() => {
            try {
                let query = req.body;
                debug('detail %o', query);
                let detail = await psat_pl.update_info_produk(query);
                if (detail.status == '400') { res.status(400).json({ detail }); } else { res.status(200).json({ detail }); }
            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        }
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async delete_unit_produksi(req, res, next) {
        let callback = async() => {
            try {
                let id = req.query.id;
                debug('detail %o', id);
                let detail = await psat_pl.delete_unit_produksi(id);
                if (detail.status == '400') { res.status(400).json({ detail }); } else { res.status(200).json({ detail }); }
            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        }
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async delete_daftar_pemasok(req, res, next) {
        let callback = async() => {
            try {
                let id = req.query.id;
                debug('detail %o', id);
                let detail = await psat_pl.delete_daftar_pemasok(id);
                if (detail.status == '400') { res.status(400).json({ detail }); } else { res.status(200).json({ detail }); }
            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        }
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async delete_daftar_pelanggan(req, res, next) {
        let callback = async() => {
            try {
                let id = req.query.id;
                debug('detail %o', id);
                let detail = await psat_pl.delete_daftar_pelanggan(id);
                if (detail.status == '400') { res.status(400).json({ detail }); } else { res.status(200).json({ detail }); }
            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        }
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async delete_info_produk(req, res, next) {
        let callback = async() => {
            try {
                let id = req.query.id;
                debug('detail %o', id);
                let detail = await psat_pl.delete_info_produk(id);
                if (detail.status == '400') { res.status(400).json({ detail }); } else { res.status(200).json({ detail }); }
            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        }
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async get_unit_produksi(req, res, next) {
        let callback = async() => {
            try {
                let id = req.query.id;
                debug('detail %o', id);
                let detail = await psat_pl.get_unit_produksi(id);
                if (detail.status == '400') { res.status(400).json({ detail }); } else { res.status(200).json({ detail }); }
            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        }
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async get_daftar_pemasok(req, res, next) {
        let callback = async() => {
            try {
                let id = req.query.id;
                debug('detail %o', id);
                let detail = await psat_pl.get_daftar_pemasok(id);
                if (detail.status == '400') { res.status(400).json({ detail }); } else { res.status(200).json({ detail }); }
            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        }
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async get_daftar_pelanggan(req, res, next) {
        let callback = async() => {
            try {
                let id = req.query.id;
                debug('detail %o', id);
                let detail = await psat_pl.get_daftar_pelanggan(id);
                if (detail.status == '400') { res.status(400).json({ detail }); } else { res.status(200).json({ detail }); }
            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        }
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async get_info_produk(req, res, next) {
        let callback = async() => {
            try {
                let id = req.query.id;
                debug('detail %o', id);
                let detail = await psat_pl.get_info_produk(id);
                if (detail.status == '400') { res.status(400).json({ detail }); } else { res.status(200).json({ detail }); }
            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        }
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async get_permohonan_izin(req, res, next) {
        let callback = async() => {
            try {
                let id = req.query.id;
                let user = req.query.user;
                debug('detail %o', id);
                let detail = await psat_pl.get_permohonan_izin(id, user);
                if (detail.status == '400') { res.status(400).json({ detail }); } else { res.status(200).json({ detail }); }
            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        }
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async get_list_unit_produksi(req, res, next) {
        let callback = async() => {
            try {
                let id = req.query.id;
                debug('detail %o', id);
                let detail = await psat_pl.get_list_unit_produksi(id);
                if (detail.status == '400') { res.status(400).json({ detail }); } else { res.status(200).json({ detail }); }
            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        }
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async get_list_daftar_pemasok(req, res, next) {
        let callback = async() => {
            try {
                let id = req.query.id;
                debug('detail %o', id);
                let detail = await psat_pl.get_list_daftar_pemasok(id);
                if (detail.status == '400') { res.status(400).json({ detail }); } else { res.status(200).json({ detail }); }
            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        }
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async get_list_daftar_pelanggan(req, res, next) {
        let callback = async() => {
            try {
                let id = req.query.id;
                debug('detail %o', id);
                let detail = await psat_pl.get_list_daftar_pelanggan(id);
                if (detail.status == '400') { res.status(400).json({ detail }); } else { res.status(200).json({ detail }); }
            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        }
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async get_list_info_produk(req, res, next) {
        let callback = async() => {
            try {
                let id = req.query.id;
                debug('detail %o', id);
                let detail = await psat_pl.get_list_info_produk(id);
                if (detail.status == '400') { res.status(400).json({ detail }); } else { res.status(200).json({ detail }); }
            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        }
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async get_history_pengajuan(req, res, next) {
        let callback = async() => {
            try {
                let user = req.query.user;
                let code_proses = req.query.code;
                let proses_pengajuan = req.query.proses;
                let role = req.query.role;
                let search = req.query.search;
                let page = req.query.page;
                let limit = req.query.limit;
                debug('detail %o', user);
                let detail = await psat_pl.get_history_pengajuan(page, limit, user, code_proses, role, proses_pengajuan, search);
                if (detail.status == '400') { res.status(400).json({ detail }); } else { res.status(200).json({ detail }); }
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

module.exports = new PsatPlPermohonanController();