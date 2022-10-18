const Router = require('express').Router();
const controllers = require('./controllers.js');
const auth = require('../../middleware/auth.js')

Router.get('/statistik_registrasi', controllers.statistik_registrasi)
      .get('/registrasi_by_provinsi', controllers.registrasi_by_provinsi)
      .get('/komoditas', controllers.komoditas)

module.exports = Router;