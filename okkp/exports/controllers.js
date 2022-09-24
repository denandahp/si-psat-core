const authUtils = require('../../controllers/utils/auth.js');
const model = require('./models.js');
const utils = require('../utils.js')


class ExportController {
    async model_exports(req, res, next) {
        let callback = async() => {
            try {
                let requset_body = req.body;
                let response = await model.model_exports(requset_body);
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
}

module.exports = new ExportController();