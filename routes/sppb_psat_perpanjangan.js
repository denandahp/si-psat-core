const Router = require('express').Router();
const sppb = require('../controllers/sppb_psat_perpanjangan.js');
const auth = require('../middleware/auth.js');


Router.post('/perpanjangan/create', auth, sppb.perpanjangan_masa_berlaku)
    .put('/perpanjangan/update', auth, sppb.update_perpanjangan_masa_berlaku)
    .put('/perpanjangan/nomor-sppb-psat/update', auth, sppb.update_perpanjangan_nomor_sppb_psat)
    .get('/perpanjangan/detail', auth, sppb.get_perpanjangan_masa_berlaku)




module.exports = Router;