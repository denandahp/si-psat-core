const Router = require('express').Router();
const upload = require('../controllers/utils/upload_file.js');


Router.post('/file', upload.upload_file)
      .get('/view_pdf', upload.view_pdf)




module.exports = Router;