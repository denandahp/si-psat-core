const authUtils = require('../utils/auth.js');
const multer = require('../../controllers/utils/upload.js');

var param = multer.param();


class UploadController {
    async upload_file(req, res) {
        param(req, res, (err) =>{
            try {
                let response = [], fileLocation, fileArray;
                if( err ){
                    throw new Error(err.message);
                }else{
                    if( req.files === undefined ){
                        console.log(err.message)
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
}

module.exports = new UploadController();