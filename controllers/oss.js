const debug = require('debug')('app:controller:oss');
const authUtils = require('./utils/auth');
const oss = require('../models/oss_tmp.js');


class OSSController {
    async generate_key(req, res, next) {
        let callback = async() => {
            try {
                let data = req.headers;
                let type = req.headers.type;

                let detail = await oss.generate_user_key(type);
                if (detail.status == '400') { res.status(400).json({ detail }); } else { res.status(200).json({ response: 200, data: detail }); }
            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        };
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async pelaku_usaha(req, res, next) {
        let callback = async() => {
            try {
                let data = req.query;
                console.log("ja")
                let access_token = req.headers.authorization.split('Bearer ')[1];
                let detail = await oss.pelaku_usaha(data, access_token);
                if (detail.status == '400') { res.status(400).json({ detail }); } else { res.status(200).json({ response: 200, data: detail }); }
            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        };
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async validate_token(req, res, next) {
        let callback = async() => {
            try {
                let data = req.query;
                let access_token = req.headers.authorization.split('Bearer ')[1];
                let detail = await oss.validate_token(data, access_token);

                if (detail.status == '400') { res.status(400).json({ detail }); } else { res.status(200).json({ response: 200, data: detail }); }
            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        };
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async receive_nib(req, res, next) {
        let callback = async() => {
            try {
                let data = req.body;
                let token = req.query.token;

                let detail = await oss.receive_nib(data, token);
                if (detail.status == '400') { res.status(400).json({ detail }); } else { res.status(200).json({ responreceiveNIB: detail }); }
            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        };
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async send_license(req, res, next) {
        let callback = async() => {
            try {
                let masa_berlaku = new Date(req.body.masa_berlaku).toISOString().split('T')[0]
                let date = new Date().toISOString().split('T')[0]


                let mapReduce = {
                    nomor_izin: req.body.nomor_sppb_psat,
                    tgl_terbit_izin: date,
                    tgl_berlaku_izin: masa_berlaku,
                    nama_ttd: "#",
                    nip_ttd: "#",
                    jabatan_ttd: "#",
                    status_izin: "50",
                    file_izin: "#",
                    keterangan: "#",
                    file_lampiran: "#",
                    nomenklatur_nomor_izin: "#"
                }

                let params = [req.query.no_identitas, req.query.id_izin]

                let data_license = await oss.get_data_license(params)
                let body = {...data_license, ...mapReduce };


                let detail_key = await oss.generate_user_key(body.nib);

                let detail = await oss.send_license(body, detail_key.user_key);

                if ((detail.OSS_result.responreceiveLicense.kode == 400)) {
                    res.status(400).json(detail);
                } else {
                    next()
                    req.body.oss = detail
                    req.body.user_key = detail_key.user_key
                }
            } catch (e) {

                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        };
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async send_license_status(request) {

        try {
            let params = await oss.get_izn_by_idpengguna(request.body.id_pengajuan, request.body.tipe_permohonan)


            let data_license = await oss.get_data_license([params.no_identitas, params.id_izin])
            let date = new Date().toISOString().split('T')[0]
            let add_body = {

                tgl_status: date,
                nip_status: "-",
                nama_status: "DISETUJUI",
                keterangan: "Berhasil",
                data_pnbp: {
                    kd_akun: "",
                    kd_penerimaan: "",
                    kd_billing: "",
                    tgl_billing: "",
                    tgl_expire: "",
                    nominal: "",
                    url_dokumen: ""
                }
            }


            let body = {...data_license, ...request.body, ...add_body };

            let detail_key = await oss.generate_user_key(body.nib);

            let detail = await oss.send_license_status(body, detail_key.user_key);

            return detail.OSS_result.responreceiveLicenseStatus.kode

        } catch (e) {
            return 404
        }


    }

    async send_fileDS(req, res, next) {
        let callback = async() => {
            try {
                let body = req.body;

                let detail_key = await oss.generate_user_key(body.receiveFileDS.nib);

                let detail = await oss.send_fileDS(body, detail_key.user_key);
                // if ((detail.OSS_result.responreceiveLicenseStatus.kode == 400)) {
                res.status(200).json(detail);
                // } else {
                //     res.status(200).json(detail);
                // }
            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        };
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async send_license_final(req, res, next) {
        let callback = async() => {
            try {
                let body = req.body;
                let user_key = req.headers.user_key;
                debug('detail %o', body);
                let detail = await oss.send_license_final(body, user_key);
                if (detail.status == '400') { res.status(400).json({ detail }); } else { res.status(200).json({ responreceiveNIB: detail }); }
            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        };
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async get_list_izin_oss(req, res, next) {
        let callback = async() => {
            try {
                let no_identitas = req.query.no_identitas;
                let kode_izin = req.query.kode_izin;
                debug('detail %o', no_identitas);
                let detail = await oss.get_list_izin_oss(no_identitas, kode_izin);
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

module.exports = new OSSController();