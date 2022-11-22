const dotenv = require('dotenv');
const format_date = require('../../models/param/utils.js');
var fs = require('fs');
const multer = require('multer');
const path = require('path');

dotenv.config();

exports.param = () => {
    var date = format_date.time_format();
    var dir;
    const diskStorage = multer.diskStorage({
        // konfigurasi folder penyimpanan file
        destination: function(req, file, cb) {
            if(['LOKAL', 'STAGING', 'PRODUCTION'].includes(process.env.NODE_ENV)){
                dir = path.join(process.cwd(), `/media/${date}/`);
            }else {
                dir = `si-psat-core/media/${date}/`;
            };

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            cb(null, dir);
        },
        // konfigurasi penamaan file yang unik
        filename: function(req, file, cb) {
            let name = file.originalname.replace(path.extname(file.originalname), '').replace(/ /g, '_').toLowerCase()
            cb(
                null, name + String(Date.now()) + path.extname(file.originalname)
            );
        },
    });

    return multer({
        storage: diskStorage,
    }).array('files', 12);
}

exports.clean_size = (files) => {
    var limit;
    let extension = path.extname(files.path)
    if(extension == '.jpg' || extension == '.png'){
        limit = 5000;
    }else{
        limit = 5000;
    }
    if (files.size >= (limit * 1024)) {
        let msg = `Ukuran file ${files.fieldname} melebihi ${limit/1000} Mb`
        return { err: 'FILE_TO_LARGE', message: msg }
    } else {
        return { err: '200' }
    }
}