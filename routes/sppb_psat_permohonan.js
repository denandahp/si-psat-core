const Router = require('express').Router();
const sppb = require('../controllers/sppb_psat_permohonan.js');


Router.post('/permohonan/create', sppb.permohonan_awal)
      .post('/unit-produksi/add', sppb.unit_produksi)
      .post('/ruang-lingkup/add', sppb.ruang_lingkup)
      .put('/unit-produksi/update', sppb.update_unit_produksi)
      .put('/ruang-lingkup/update', sppb.update_ruang_lingkup)
      .delete('/unit-produksi/delete', sppb.delete_unit_produksi)
      .delete('/ruang-lingkup/delete', sppb.delete_ruang_lingkup)

module.exports = Router;