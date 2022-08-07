const Router = require('express').Router();
const notifikasi = require('../controllers/notifikasi.js');
const auth = require('../middleware/auth.js');


Router.put('/read_notifikasi', auth, notifikasi.read_notifikasi)
      .get('/history', auth, notifikasi.history_notifikasi)

module.exports = Router;