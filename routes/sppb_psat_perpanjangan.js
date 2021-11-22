const Router = require('express').Router();
const sppb = require('../controllers/sppb_psat_perpanjangan.js');


Router.post('/perpanjangan/create', sppb.perpanjangan_masa_berlaku)
      .put('/perpanjangan/update', sppb.update_perpanjangan_masa_berlaku)
      .put('/perpanjangan/nomor-sppb-psat/update', sppb.update_perpanjangan_nomor_sppb_psat)
      .get('/perpanjangan/detail', sppb.get_perpanjangan_masa_berlaku)

    


module.exports = Router;