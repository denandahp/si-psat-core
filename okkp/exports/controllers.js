const authUtils = require('../../controllers/utils/auth.js');
const model = require('./models.js');
const utils = require('../utils.js')


class ExportController {
    async export_registration(req, res, next) {
        let callback = async() => {
            try {
                let requset_body = req.body;
                let response = await model.export_registration(requset_body);
                let {workbook, dir}= await utils.exports(response.jenis_registrasi, response.keys)
                try {
                    await workbook.xlsx.writeFile(dir)
                        .then(() => {
                        res.send({
                            status: "success",
                            message: "file successfully downloaded",
                            path: dir,
                        });
                     });
                } catch (err) {
                        console.log("error" + err)
                        res.send({
                        status: "error",
                        message: "Something went wrong",
                    });
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

    async export_uji_lab(req, res, next) {
        let callback = async() => {
            try {
                let requset_body = req.body;
                let response = await model.export_uji_lab(requset_body);
                let {workbook, dir}= await utils.exports(response.uji_lab, response.keys)
                try {
                    await workbook.xlsx.writeFile(dir)
                        .then(() => {
                        res.send({
                            status: "success",
                            message: "file successfully downloaded",
                            path: dir,
                        });
                     });
                } catch (err) {
                        console.log("error" + err)
                        res.send({
                        status: "error",
                        message: "Something went wrong",
                    });
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

    async export_rapid_test(req, res, next) {
        let callback = async() => {
            try {
                let requset_body = req.body;
                let response = await model.export_rapid_test(requset_body);
                let {workbook, dir}= await utils.exports(response.rapid_test, response.keys)
                try {
                    await workbook.xlsx.writeFile(dir)
                        .then(() => {
                        res.send({
                            status: "success",
                            message: "file successfully downloaded",
                            path: dir,
                        });
                     });
                } catch (err) {
                        console.log("error" + err)
                        res.send({
                        status: "error",
                        message: "Something went wrong",
                    });
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
}

module.exports = new ExportController();