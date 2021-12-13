const Router = require('express').Router();
const upload = require('../controllers/utils/upload_file.js');


Router.post('/file', upload.upload_file)
      .get('/view_pdf', upload.view_pdf)
      .get('/display_image', upload.display_image)

module.exports = Router;