const Router = require('express').Router();
const notifikasi = require('../controllers/notifikasi.js');


Router.put('/read_notifikasi', notifikasi.read_notifikasi)
      .get('/history', notifikasi.history_notifikasi)

module.exports = Router;