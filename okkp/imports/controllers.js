const authUtils = require('../../controllers/utils/auth.js');
var fs = require('fs');
const format_date = require('../../models/param/utils.js');
const readXlsxFile = require('read-excel-file/node')
const utils = require('./utils.js')
const model = require('./models.js');

var date = format_date.time_format();


class ImportController {
    async import_excels(req, res, next) {
        let callback = async() => {
            try {
                if (req.file === undefined) {
                    throw new Error('No File Selected')
                } else {
                    let body = req.body
                    let excel_file = req.file;
                    let user = req.user.data.data;
                    let data = await readXlsxFile(excel_file.path)
                                    .then(async (raw_data) => {
                                        let is_valid = await utils.validation_headers(raw_data.shift(), body)
                                        if(is_valid === true){
                                            return raw_data;
                                        } else{
                                            throw new Error('Format judul kolom tidak sesuai dengan contoh template.')
                                        }
                                    })
                    let response = await model.model_imports(data, body, user)
                    if (response.status == '400') {res.status(400).json({ response });}
                    else { res.status(200).json({ response });}
                }
            } catch (e) {
                res.status(400).json({ status: '400', Error: "" + e.message })
                next(e.detail || e);
            }
        };
        let fallback = (err) => {
            next(err);
        }
        authUtils.processRequestWithJWT(req, callback, fallback);
    }
}

module.exports = new ImportController();