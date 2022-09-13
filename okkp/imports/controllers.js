var fs = require('fs');
const format_date = require('../../models/param/utils.js');
const readXlsxFile = require('read-excel-file/node')
const utils = require('./utils.js')
const model = require('./models.js');

var date = format_date.time_format();


class ImportController {
    async import_excels(req, res) {
        try {
            let response = [], excel_file, model_import, is_valid = false, data;
            if (req.file === undefined) {
                throw new Error('No File Selected')
            } else {
                let body = req.body
                excel_file = req.file;
                await readXlsxFile(excel_file.path)
                    .then((raw_data) => {
                        is_valid = utils.validation_headers(raw_data.shift(), body)
                        data = raw_data
                    })
                if (is_valid == true){
                    model_import = await model.model_imports(data, body)
                }
                res.status(200).json({ response: response });
            };
        } catch (e) {
            res.status(400).json({ error: e.message });
            console.log("error" + e)
        }
    }
}

module.exports = new ImportController();