const Router = require('express').Router();
const controllers = require('./controllers.js');
const auth = require('../../middleware/auth.js')

Router.get('/komoditas', controllers.index_komoditas)
      .get('/jenis_hc', controllers.index_komoditas)
      .get('/jenis_registrasi', controllers.index_jenis_registrasi)
      .get('/jenis_sertifikat', controllers.index_jenis_sertifikat)
      .get('/status', controllers.index_status)
      .post('/sync_data', controllers.sync_data)

module.exports = Router;