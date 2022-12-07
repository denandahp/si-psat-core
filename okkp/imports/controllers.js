const authUtils = require('../../controllers/utils/auth.js');
var fs = require('fs');
const format_date = require('../../models/param/utils.js');
const readXlsxFile = require('read-excel-file/node')
const utils = require('./utils.js')
const utils_core = require('../utils.js')
const model = require('./models.js');

var date = format_date.time_format();


class ImportController {
    async import_excels_registration(req, res, next) {
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
                    let response = await model.import_excels_registration(data, body, user)
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

    async import_excels_uji_lab(req, res, next) {
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
                    let response = await model.import_excels_uji_lab(data, body, user)
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

    async ploting_excel(req, res, next) {
        let callback = async() => {
            if (req.file === undefined) {
                throw new Error('No File Selected')
            } else {
                let body = req.body
                let excel_file = req.file;
                let nama_prov_list = await utils.export_plotting_provinsi()
                for(let nama_prov of nama_prov_list){
                    let headers;
                    nama_prov = nama_prov[0]
                    let data = await readXlsxFile(excel_file.path)
                                    .then(async (raw_data) => {
                                        headers = raw_data.shift()
                                        let data_perprov = [];
                                        for(let element of raw_data){
                                            if(element[3] != null && element[3] != 0){
                                                const found = nama_prov.some(r=> element[3].includes(r))
                                                if(found){
                                                    data_perprov.push(element)
                                                }
                                            }
                                        }
                                        return data_perprov
                                    })
                    if(data.length == 0){
                        continue
                    }
                    let {workbook, dir}= await utils_core.exports(data, headers, nama_prov)
                    await workbook.xlsx.writeFile(dir)
                            .then(() => {
                                console.log("file successfully downloaded", nama_prov[0], data.length)
                            });
                    // try {
                    //     await workbook.xlsx.writeFile(dir)
                    //         .then(() => {
                    //         res.send({
                    //             status: "success",
                    //             message: "file successfully downloaded",
                    //             path: dir,
                    //         });
                    //      });
                    // } catch (err) {
                    //         console.log("error" + err)
                    //         res.send({
                    //         status: "error",
                    //         message: "Something went wrong",
                    //     });
                    // }
                }
            }
        };
        let fallback = (err) => {
            next(err);
        }
        authUtils.processRequestWithJWT(req, callback, fallback);
    }
}

module.exports = new ImportController();