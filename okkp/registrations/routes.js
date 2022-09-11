const Router = require('express').Router();
const controllers = require('./controllers.js');
const auth = require('../../middleware/auth.js')

Router.post('/add', auth, controllers.create_registrations)
      .put('/update', auth, controllers.update_registrations)

module.exports = Router;