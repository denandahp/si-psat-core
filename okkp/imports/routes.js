const Router = require('express').Router();
const imports = require('./controllers.js');
const auth = require('../../middleware/auth.js')
const multer = require('./utils.js');

var param = multer.param();

Router.post('', auth, param, imports.import_excels_registration)
      .post('/uji_lab', auth, param, imports.import_excels_uji_lab)
      .post('/ploting', param, imports.ploting_excel)


module.exports = Router;