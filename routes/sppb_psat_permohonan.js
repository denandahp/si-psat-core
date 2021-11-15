const Router = require('express').Router();
const sppb = require('../controllers/sppb_psat_permohonan.js');


Router.post('/permohonan/create', sppb.permohonan_awal)
      .post('/unit-produksi/add', sppb.unit_produksi)
      .post('/ruang-lingkup/add', sppb.ruang_lingkup)
      .put('/nomor-sppb-psat/update', sppb.update_nomor_sppb_psat)
      .put('/unit-produksi/update', sppb.update_unit_produksi)
      .put('/ruang-lingkup/update', sppb.update_ruang_lingkup)
      .delete('/unit-produksi/delete', sppb.delete_unit_produksi)
      .delete('/ruang-lingkup/delete', sppb.delete_ruang_lingkup)
      .get('/permohonan/detail', sppb.get_permohonan_awal)
      .get('/unit-produksi/detail', sppb.get_unit_produksi)
      .get('/ruang-lingkup/detail', sppb.get_ruang_lingkup)
      .get('/history', sppb.get_history_pengajuan)


module.exports = Router;