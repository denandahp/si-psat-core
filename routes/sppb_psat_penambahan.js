const Router = require('express').Router();
const sppb = require('../controllers/sppb_psat_penambahan.js');


Router.post('/penambahan/create', sppb.penambahan_ruang_lingkup)
    .put('/penambahan/update', sppb.update_penambahan_ruang_lingkup)
    .put('/penambahan/nomor-sppb-psat/update', sppb.update_penambahan_nomor_sppb_psat)
    .get('/penambahan/detail', sppb.get_penambahan_masa_berlaku)

module.exports = Router;