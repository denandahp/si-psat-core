const Router = require('express').Router();
const controllers = require('./controllers.js');
const auth = require('../../middleware/auth.js')

Router.get('/statistik_registrasi', auth, controllers.statistik_registrasi)
      .get('/registrasi_by_provinsi', auth, controllers.registrasi_by_provinsi)



module.exports = Router;