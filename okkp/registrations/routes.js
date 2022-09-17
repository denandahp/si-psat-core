const Router = require('express').Router();
const controllers = require('./controllers.js');
const auth = require('../../middleware/auth.js')

Router.get('', auth, controllers.index_registrasi)
      .get('/index_sertifikasi', auth, controllers.index_sertifikasi)
      .get('/detail', auth, controllers.detail_registrations)
      .post('/add', auth, controllers.create_registrations)
      .put('/update', auth, controllers.update_registrations)
      .delete('/delete', auth, controllers.delete_registrations)
module.exports = Router;