const Router = require('express').Router();
const imports = require('./controllers.js');
const auth = require('../../middleware/auth.js')
const multer = require('./utils.js');

var param = multer.param();

Router.post('', param, imports.import_excels)

module.exports = Router;