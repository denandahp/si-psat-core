const Router = require('express').Router();
const upload = require('../controllers/utils/upload_file.js');
const auth = require('../middleware/auth.js');


Router.post('/file', auth, upload.upload_file)
      .get('/view_pdf', auth, upload.view_pdf)
      .get('/display_image', auth, upload.display_image)

module.exports = Router;