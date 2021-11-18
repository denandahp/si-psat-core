const authUtils = require('../utils/auth.js');
var fs = require('fs');
const multer = require('../../controllers/utils/upload.js');

var param = multer.param();


class UploadController {
    async upload_file(req, res) {
        param(req, res, (err) =>{
            try {
                let response = [], fileLocation, fileArray;
                if( err ){
                    throw new Error(err);
                }else{
                    if( req.files === undefined ){
                        throw new Error('No File Selected')
                    }else {
                        fileArray = req.files;
                        for(var k in fileArray){
                            let size = multer.clean_size(fileArray[k]);
                            if (size.err == 'FILE_TO_LARGE'){
                                throw new Error(size.message)
                            }else{
                                fileLocation = fileArray[k].path;
                                response.push(fileLocation)
                            }
                        }
                        res.status(200).json({ response: response });
                    }
                }
            } catch (e) {
                res.status(400).json({error: e.message} );
                console.log("error" + e)
            }
        });
    }

    async view_pdf(req, res) {
        try {
            let path = req.query.path;
            var file = fs.createReadStream(path);
            var stat = fs.statSync(path);
            res.setHeader('Content-Length', stat.size);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=quote.pdf');
            file.pipe(res);

        } catch (e) {
            res.status(400).json({error: e.message} );
            console.log("error" + e)
        }
    }
}

module.exports = new UploadController();