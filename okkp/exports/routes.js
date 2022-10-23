const Router = require('express').Router();
const controllers = require('./controllers.js');
const auth = require('../../middleware/auth.js')


Router.post('', controllers.export_registration)
      .post('/uji_lab', controllers.export_uji_lab)
      .post('/rapid_test', controllers.export_rapid_test)


module.exports = Router;