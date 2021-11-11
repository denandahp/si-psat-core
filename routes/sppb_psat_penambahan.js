const Router = require('express').Router();
const sppb = require('../controllers/sppb_psat_penambahan.js');


Router.post('/penambahan/create', sppb.penambahan_ruang_lingkup)

module.exports = Router;