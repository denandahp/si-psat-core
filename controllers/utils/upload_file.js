const authUtils = require('../utils/auth.js');
var fs = require('fs');
const format_date = require('../../models/param/utils.js');
const multer = require('../../controllers/utils/upload.js');
const path = require('path');

var date = format_date.time_format();
var param = multer.param();


class UploadController {
    async upload_file(req, res) {
        param(req, res, (err) => {
            try {
                let response = [],
                    fileLocation, fileArray;
                if (err) {
                    throw new Error(err);
                } else {
                    if (req.files === undefined) {
                        throw new Error('No File Selected')
                    } else {
                        fileArray = req.files;
                        for (var k in fileArray) {
                            let size = multer.clean_size(fileArray[k]);
                            let save_folder = 'media'
                            let save_folder_length = save_folder.length + 1
                            if (size.err == 'FILE_TO_LARGE') {
                                throw new Error(size.message)
                            } else {
                                fileLocation = fileArray[k].path;
                                fileLocation = fileLocation.substring(fileLocation.indexOf(save_folder) + save_folder_length)
                                response.push(fileLocation)
                            };
                        };
                        res.status(200).json({ response: response });
                    };
                };
            } catch (e) {
                res.status(400).json({ error: e.message });
                console.log("error" + e)
            }
        });
    }

    async view_pdf(req, res) {
        try {
            let path_file = req.query.path;
            let query_path = path.join(process.cwd(), `/media/${path_file}`);
            if (fs.existsSync(query_path)) {
                let ext_file = path.extname(query_path)
                if(ext_file == ".pdf"){
                    res.setHeader('Content-Type', 'application/pdf');
                }else{
                    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                }
                let filename = query_path.split('/')
                var file = fs.createReadStream(query_path);
                var stat = fs.statSync(query_path);
                res.setHeader('Content-Length', stat.size);
                res.setHeader('Content-Disposition', `attachment; filename=${filename[filename.length-1]}`);
                file.pipe(res);
            } else {
                throw new Error('File not found!')
            }

        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    }

    async display_image(req, res) {
        try {
            let query_path = req.query.path;
            if (fs.existsSync(query_path)) {
                res.sendFile(query_path);
            } else {
                throw new Error('File not found!')
            };
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    }
}

module.exports = new UploadController();