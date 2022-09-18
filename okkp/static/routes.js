const Router = require('express').Router();
const controllers = require('./controllers.js');
const auth = require('../../middleware/auth.js')

Router.get('/status', controllers.index_status)
      .get('/provinsi', controllers.index_provinsi)
      .post('/sync_data', controllers.sync_data)

      .get('/komoditas', controllers.index_komoditas)
      .post('/komoditas/add', controllers.create_komoditas)
      .put('/komoditas/update', controllers.update_komoditas)
      .delete('/komoditas/delete', controllers.delete_komoditas)

      .get('/jenis_registrasi', controllers.index_jenis_registrasi)
      .post('/jenis_registrasi/add', controllers.create_jenis_registrasi)
      .put('/jenis_registrasi/update', controllers.update_jenis_registrasi)
      .delete('/jenis_registrasi/delete', controllers.delete_jenis_registrasi)

      .get('/jenis_sertifikat', controllers.index_jenis_sertifikat)
      .post('/jenis_sertifikat/add', controllers.create_jenis_sertifikat)
      .put('/jenis_sertifikat/update', controllers.update_jenis_sertifikat)
      .delete('/jenis_sertifikat/delete', controllers.delete_jenis_sertifikat)

      .get('/jenis_hc', controllers.index_jenis_hc)
      .post('/jenis_hc/add', controllers.create_jenis_hc)
      .put('/jenis_hc/update', controllers.update_jenis_hc)
      .delete('/jenis_hc/delete', controllers.delete_jenis_hc)

module.exports = Router;