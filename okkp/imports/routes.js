const Router = require('express').Router();
const imports = require('./controllers.js');
const auth = require('../../middleware/auth.js')
const multer = require('./utils.js');

var param = multer.param();

Router.post('', auth, param, imports.import_excels)

module.exports = Router;