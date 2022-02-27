const sppb_psat_view = require('../../models/sppb_psat_view.js')
const sppb_pl_view = require('../../models/sppb_pl_view.js')
const sppbGenerator = require('./sppbGenerator')

const izinedarGenerator = require('./izinedarGenerator');
const authUtils = require('../utils/auth');

const oss = require('../../models/oss_tmp.js')



var date = new Date(Date.now());
date.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
class generatePdfController {


    async sppb_psat(req, res, next) {
        let callback = async() => {
            try {
                const def = req.body
                const param = req.params
                const type = req.query.type

                let sertifikat_psat = await sppb_psat_view.view_sertifikat(param)
                let unit_produksi = await sppb_psat_view.view_unitproduksi(sertifikat_psat.unit_produksi)
                let result;

                if (type == 'PENGALIHAN') {
                    result = await sppbGenerator.sppb_pengalihan(sertifikat_psat, unit_produksi, def, req.method)
                } else {
                    result = await sppbGenerator.sppb_permohonan(sertifikat_psat, def, req.method)
                }

                if (req.method == 'GET') {
                    res.status(200).json(result)
                } else {
                    req.body.oss = detail

                    let sertifikat_psat = await sppb_psat_view.view_sertifikat(param)
                    let unit_produksi = await sppb_psat_view.view_unitproduksi(sertifikat_psat.unit_produksi)
                    let result;

                    if (type == 'PENGALIHAN') {
                        result = await sppbGenerator.sppb_pengalihan(sertifikat_psat, unit_produksi, def, req.method)

                    } else {
                        result = await sppbGenerator.sppb_permohonan(sertifikat_psat, def, req.method)

                    }
                    let view_pdf = 'http://103.161.184.37:3000/api/upload/view_pdf?path=' + result.path

                    let mapReduce = {
                        nomor_izin: req.body.nomor_sppb_psat,
                        tgl_terbit_izin: date,
                        tgl_berlaku_izin: berlaku_sampai,
                        nama_ttd: "#",
                        nip_ttd: "#",
                        jabatan_ttd: "#",
                        status_izin: "50",
                        file_izin: view_pdf,
                        keterangan: "#",
                        file_lampiran: "#",
                        nomenklatur_nomor_izin: "#"
                    }

                    let data_license = await oss.get_data_license([req.query.no_identitas, req.query.id_izin])

                    let body_license = {...result, ...data_license, ...mapReduce };

                    let detail_key = await oss.generate_user_key(body_license.nib);
                    let detail = await oss.send_license(body_license, detail_key.user_key);
                    if ((detail.OSS_result.responreceiveLicense.kode == 200)) {
                        let respone = await {...detail, ...result }
                        res.status(200).json(respone)

                    } else {
                        res.status(400);

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

    async psat_pl(req, res, next) {
        let callback = async() => {
            // try {
                const def = req.body
                const param = req.params
                const type = req.query.type




                let sertifikat_pl = await sppb_pl_view.view_sertifikat(param)
                let unit_produksi = await sppb_pl_view.view_unitproduksi(sertifikat_pl.unit_produksi)
                let result;
                if (type == 'PERMOHONAN') {
                    result = await izinedarGenerator.permohonan(sertifikat_pl, unit_produksi, def, req.method)

                } else if (type == 'PERUBAHAN') {
                    result = await izinedarGenerator.perubahandata(sertifikat_pl, unit_produksi, def, req.method)

                } else {
                    result = await izinedarGenerator.pengalihan(sertifikat_pl, unit_produksi, def, req.method)

                }


                if (req.method == 'GET') {
                    res.status(200).json(result)
                } else {

                    let berlaku_sampai = new Date(req.body.berlaku_sampai).toISOString().split('T')[0]
                    let date = new Date().toISOString().split('T')[0]
                    let view_pdf = 'http://103.161.184.37:3000/api/upload/view_pdf?path=' + result.path

                    let mapReduce = {
                        nomor_izin: req.body.nomor_izin_edar,
                        tgl_terbit_izin: date,
                        tgl_berlaku_izin: berlaku_sampai,
                        nama_ttd: "#",
                        nip_ttd: "#",
                        jabatan_ttd: "#",
                        status_izin: "50",
                        file_izin: view_pdf,
                        keterangan: "#",
                        file_lampiran: "#",
                        nomenklatur_nomor_izin: "#"
                    }

                    let data_license = await oss.get_data_license([req.query.no_identitas, req.query.id_izin])

                    let body_license = {...result, ...data_license, ...mapReduce };

                    let detail_key = await oss.generate_user_key(body_license.nib);
                    let detail = await oss.send_license(body_license, detail_key.user_key);
                    if ((detail.OSS_result.responreceiveLicense.kode == 200)) {
                        let respone = await {...detail, ...result }
                        res.status(200).json(respone)

                    } else {
                        res.status(400);

                    }
                }
            // } catch (e) {
            //   //  next(e.detail || e);
            // }
        };
        let fallback = (err) => {
            next(err);
        }
        authUtils.processRequestWithJWT(req, callback, fallback);
    }


}

module.exports = new generatePdfController();