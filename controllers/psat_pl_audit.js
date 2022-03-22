const debug = require('debug')('app:controller:psat_pl_audit');
const authUtils = require('./utils/auth');
const audit = require('../models/psat_pl_audit.js');
const oss = require('../models/oss_tmp.js')

async function oss_integration(data, keterangan) {
    console.log("oss integration ...")
    let params = await oss.get_izn_by_idpengguna(data.body.id_pengajuan, data.body.tipe_permohonan)

    let data_license = await oss.get_data_license([params.no_identitas, params.id_izin])
    let date = new Date().toISOString().split('T')[0]
    let add_body = {

        tgl_status: date,
        nip_status: "-",
        nama_status: "DISETUJUI",
        keterangan: keterangan,
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


    let body = {...data_license, ...data.body, ...add_body };
    let detail_key = await oss.generate_user_key(body.nib);

    let detail_status = await oss.send_license_status(body, detail_key.user_key);
    console.log(detail_status)
    return detail_status
}

class AuditDokumenController {
    async permohonan_baru(req, res, next) {
        let callback = async() => {
            try {
                let query = req.body;
                debug('detail %o', query);
                let detail_permohonan = await audit.permohonan_baru(query);
                if (detail_permohonan.status == '400') {
                    res.status(400).json({ detail_permohonan });
                } else {
                    req.body.tipe_permohonan = 'IZIN-EDAR'
                    let keterangan;
                    if (req.body.proses == "REVISION") {
                        req.body.kd_status = "11"
                        keterangan = "Perbaikan Permohonan Baru"
                    } else if (req.body.proses == "REVIEW") {
                        req.body.kd_status = "11"
                        keterangan = "Permohonan Baru"
                    } else if (req.body.proses == "CLEAR") {
                        req.body.kd_status = "11"
                        keterangan = "Permohonan Baru Sesuai"
                    }
                    let detail_status = await oss_integration(req, keterangan)
                    let detail = {...detail_permohonan, ...detail_status }
                    if (detail.OSS_result.responreceiveLicenseStatus.kode == 200) {
                        res.status(200).json({ detail });
                    } else {
                        res.status(400).json({ detail });
                    }

                }
            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        }
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async penunjukkan_auditor(req, res, next) {
        let callback = async() => {
            try {
                let query = req.body;
                debug('detail %o', query);
                let detail_permohonan = await audit.penunjukkan_auditor(query);
                if (detail_permohonan.status == '400') {
                    res.status(400).json({ detail_permohonan });
                } else {
                    req.body.tipe_permohonan = 'IZIN-EDAR'
                    req.body.kd_status = "20"
                    let keterangan = "Penunjukan Auditor"
                    let detail_status = await oss_integration(req, keterangan)
                    let detail = {...detail_permohonan, ...detail_status }
                    if (detail.OSS_result.responreceiveLicenseStatus.kode == 200) {
                        res.status(200).json({ detail });
                    } else {
                        res.status(400).json({ detail });
                    }

                }
            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        }
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async audit_dokumen(req, res, next) {
        let callback = async() => {
            try {
                let query = req.body;
                debug('detail %o', query);
                let detail_permohonan = await audit.audit_dokumen(query);
                if (detail_permohonan.status == '400') {
                    res.status(400).json({ detail_permohonan });
                } else {
                    req.body.tipe_permohonan = 'IZIN-EDAR'
                    let keterangan;
                    if (req.body.proses == "REVISION") {
                        req.body.kd_status = "20"
                        keterangan = "Perbaikan Audit Dokumen"
                    } else if (req.body.proses == "REVIEW") {
                        req.body.kd_status = "20"
                        keterangan = "Audit Dokumen"
                    } else if (req.body.proses == "CLEAR") {
                        req.body.kd_status = "20"
                        keterangan = "Audit Dokumen Sesuai"
                    }
                    let detail_status = await oss_integration(req, keterangan)
                    let detail = {...detail_permohonan, ...detail_status }
                    if (detail.OSS_result.responreceiveLicenseStatus.kode == 200) {
                        res.status(200).json({ detail });
                    } else {
                        res.status(400).json({ detail });
                    }
                }
            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        }
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async penunjukkan_tim_komtek(req, res, next) {
        let callback = async() => {
            try {
                let query = req.body;
                debug('detail %o', query);
                let detail_permohonan = await audit.penunjukkan_tim_komtek(query);
                if (detail_permohonan.status == '400') {
                    res.status(400).json({ detail_permohonan });
                } else {
                    req.body.tipe_permohonan = 'IZIN-EDAR'
                    req.body.kd_status = "20"
                    let keterangan = 'Penunjukan Tim Komtek'

                    let detail_status = await oss_integration(req, keterangan)
                    let detail = {...detail_permohonan, ...detail_status }
                    if (detail.OSS_result.responreceiveLicenseStatus.kode == 200) {
                        res.status(200).json({ detail });
                    } else {
                        res.status(400).json({ detail });
                    }
                }
            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        }
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async audit_rekomendasi(req, res, next) {
        let callback = async() => {
            try {
                let query = req.body;
                debug('detail %o', query);
                let detail_permohonan = await audit.audit_rekomendasi(query);
                if (detail_permohonan.status == '400') {
                    res.status(400).json({ detail_permohonan });
                } else {
                    req.body.tipe_permohonan = 'IZIN-EDAR'
                    let keterangan;
                    if (req.body.proses == "REVISION") {
                        req.body.kd_status = "40"
                        keterangan = "Perbaikan Review/Sidang Komtek"
                    } else if (req.body.proses == "REVIEW") {
                        req.body.kd_status = "40"
                        keterangan = "Review/Sidang Komtek"
                    } else if (req.body.proses == "CLEAR") {
                        req.body.kd_status = "40"
                        keterangan = "Review/Sidang Komtek Sesuai"
                    }
                    let detail_status = await oss_integration(req, keterangan)
                    let detail = {...detail_permohonan, ...detail_status }
                    if (detail.OSS_result.responreceiveLicenseStatus.kode == 200) {
                        res.status(200).json({ detail });
                    } else {
                        res.status(400).json({ detail });
                    }
                }
            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        }
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async pembayaran_pnbp(req, res, next) {
        let callback = async() => {
            // try {
                let query = req.body;
                debug('detail %o', query);
                let detail_permohonan = await audit.pembayaran_pnbp(query);
                if (detail_permohonan.status == '400') {
                    res.status(400).json({ detail_permohonan });
                } else {
                    req.body.tipe_permohonan = 'IZIN-EDAR'
                    let keterangan
                    if (req.body.proses == "REVIEW") {
                        req.body.kd_status = "31"
                        keterangan = "Menunggu Pembayaran PNBP"
                    } else if (req.body.proses == "CLEAR") {
                        req.body.kd_status = "30"
                        keterangan = "Pembayaran PNBP Selesai"
                    }
                    let detail_status = await oss_integration(req, keterangan)
                    let detail = {...detail_permohonan, ...detail_status }
                    // if (detail.OSS_result.responreceiveLicenseStatus.kode == 200) {
                        res.status(200).json({ detail_status });
                    // } else {
                    //     res.status(400).json({ detail });
                    // }
                }
            // } catch (e) {
            //     next(e.detail || e);
            // }
        };
        let fallback = (err) => {
            next(err);
        }
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async dokumen_ditolak(req, res, next) {
        let callback = async() => {
            try {
                let query = req.body;
                debug('detail %o', query);
                let detail_permohonan = await audit.dokumen_ditolak(query);
                if (detail_permohonan.status == '400') {
                    res.status(400).json({ detail_permohonan });
                } else {
                    req.body.tipe_permohonan = 'IZIN-EDAR'
                    req.body.kd_status = "90"
                    let keterangan = "Dokumen Ditolak"
                    let detail_status = await oss_integration(req, keterangan)
                    let detail = {...detail_permohonan, ...detail_status }
                    if (detail.OSS_result.responreceiveLicenseStatus.kode == 200) {
                        res.status(200).json({ detail });
                    } else {
                        res.status(400).json({ detail });
                    }
                }
            } catch (e) {
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        }
        authUtils.processRequestWithJWT(req, callback, fallback);
    }

    async audit_history(req, res, next) {
        let callback = async() => {
            try {
                let id_pengajuan = req.query.id;
                debug('detail %o', id_pengajuan);
                let detail = await audit.audit_history(id_pengajuan);
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

    async history_pengajuan_izin_edar(req, res, next) {
        let callback = async() => {
            try {
                let user = req.query.user;
                let code_proses = req.query.code;
                let role = req.query.role;
                debug('detail %o', user);
                let detail = await audit.history_pengajuan_izin_edar(user, code_proses, role);
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

module.exports = new AuditDokumenController();