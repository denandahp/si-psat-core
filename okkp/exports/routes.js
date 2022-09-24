const Router = require('express').Router();
const controllers = require('./controllers.js');
const auth = require('../../middleware/auth.js')


Router.post('', controllers.model_exports)

module.exports = Router;