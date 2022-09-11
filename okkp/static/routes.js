const Router = require('express').Router();
const controllers = require('./controllers.js');
const auth = require('../../middleware/auth.js')

Router.get('/komoditas', controllers.index_komoditas)
      .get('/jenis_hc', controllers.index_komoditas)
      .get('/jenis_registrasi', controllers.index_komoditas)
      .get('/jenis_sertifikat', controllers.index_komoditas)

module.exports = Router;