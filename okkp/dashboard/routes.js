const Router = require('express').Router();
const controllers = require('./controllers.js');
const auth = require('../../middleware/auth.js')

Router.get('/statistik_registrasi', controllers.statistik_registrasi)
      .get('/statistik_registrasi/:year', controllers.statistik_registrasi_by_year)
      .get('/registrasi_by_provinsi', controllers.registrasi_by_provinsi)
      .get('/komoditas', controllers.komoditas)
      .get('/statistik_uji_lab', controllers.statistik_uji_lab)
      .get('/statistik_uji_lab/by_provinsi', controllers.statistik_uji_lab_by_provinsi)
      .get('/statistik_rapid_test', controllers.statistik_rapid_test)
      .get('/statistik_rapid_test/by_provinsi', controllers.statistik_rapid_test_by_provins)

module.exports = Router;