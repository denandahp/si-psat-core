const Router = require('express').Router();
const sppb = require('../controllers/sppb_psat_penambahan.js');
const auth = require('../middleware/auth.js')


Router.post('/penambahan/create', auth, sppb.penambahan_ruang_lingkup)
    .put('/penambahan/update', auth, sppb.update_penambahan_ruang_lingkup)
    .put('/penambahan/nomor-sppb-psat/update', auth, sppb.update_penambahan_nomor_sppb_psat)
    .get('/penambahan/detail', auth, sppb.get_penambahan_masa_berlaku)

module.exports = Router;