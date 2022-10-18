const Router = require('express').Router();
const controllers = require('./controllers.js');
const auth = require('../../middleware/auth.js')

Router.get('/status', controllers.index_status)
      .get('/status_uji_lab', controllers.index_status_uji_lab)
      .get('/provinsi', controllers.index_provinsi)
      .post('/sync_data', controllers.sync_data)

      // -------------------- Komoditas -------------------------------------
      .get('/komoditas', controllers.index_komoditas)
      .post('/komoditas/add', controllers.create_komoditas)
      .put('/komoditas/update', controllers.update_komoditas)
      .delete('/komoditas/delete', controllers.delete_komoditas)

      // -------------------- Jenis Registrasi -------------------------------------
      .get('/jenis_registrasi', controllers.index_jenis_registrasi)
      .post('/jenis_registrasi/add', controllers.create_jenis_registrasi)
      .put('/jenis_registrasi/update', controllers.update_jenis_registrasi)
      .delete('/jenis_registrasi/delete', controllers.delete_jenis_registrasi)

      // -------------------- Jenis Sertifikat -------------------------------------
      .get('/jenis_sertifikat', controllers.index_jenis_sertifikat)
      .post('/jenis_sertifikat/add', controllers.create_jenis_sertifikat)
      .put('/jenis_sertifikat/update', controllers.update_jenis_sertifikat)
      .delete('/jenis_sertifikat/delete', controllers.delete_jenis_sertifikat)

      // -------------------- Jenis Health Certificate -------------------------------------
      .get('/jenis_hc', controllers.index_jenis_hc)
      .post('/jenis_hc/add', controllers.create_jenis_hc)
      .put('/jenis_hc/update', controllers.update_jenis_hc)
      .delete('/jenis_hc/delete', controllers.delete_jenis_hc)

      // -------------------- Parameter Rapid Test -------------------------------------
      .get('/:paramater_rapid_test', controllers.index_param_rapid_test)
      .post('/:paramater_rapid_test/add', controllers.create_param_rapid_test)
      .put('/:paramater_rapid_test/update', controllers.update_param_rapid_test)
      .delete('/:paramater_rapid_test/delete', controllers.delete_param_rapid_test)

      // -------------------- Jenis Uji -------------------------------------
      .get('/:jenis_uji', controllers.index_jenis_uji)
      .post('/:jenis_uji/add', controllers.create_jenis_uji)
      .put('/:jenis_uji/update', controllers.update_jenis_uji)
      .delete('/:jenis_uji/delete', controllers.delete_jenis_uji)

module.exports = Router;