const Router = require('express').Router();
const sppb = require('../controllers/sppb_psat_pengalihan.js');


Router.post('/permohonan/create', sppb.permohonan_awal)
      .post('/perpanjangan/create', sppb.perpanjangan_masa_berlaku)
      .post('/penambahan/create', sppb.penambahan_ruang_lingkup)
      .post('/pengalihan/create', sppb.pengalihan_kepemilikan)
    


module.exports = Router;