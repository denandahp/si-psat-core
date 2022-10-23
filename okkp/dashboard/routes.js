const Router = require('express').Router();
const controllers = require('./controllers.js');
const auth = require('../../middleware/auth.js')

Router.get('/statistik_registrasi', controllers.statistik_registrasi)
      .get('/registrasi_by_provinsi', controllers.registrasi_by_provinsi)
      .get('/komoditas', controllers.komoditas)
      .get('/statistik_uji_lab', controllers.statistik_uji_lab)
      .get('/statistik_rapid_test', controllers.statistik_rapid_test)

module.exports = Router;