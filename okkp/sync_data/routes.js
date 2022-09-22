const Router = require('express').Router();
const controllers = require('./controllers.js');
const auth = require('../../middleware/auth.js')

Router.post('/static', controllers.sync_data_static)
      .post('/user', controllers.sync_data_user)

module.exports = Router;