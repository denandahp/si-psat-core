const Router = require('express').Router();
const sppb = require('../controllers/sppb_psat_permohonan.js');
const auth = require('../middleware/auth.js');


Router.post('/permohonan/create', auth, sppb.permohonan_awal)
    .post('/unit-produksi/add', auth, sppb.unit_produksi)
    .post('/ruang-lingkup/add', auth, sppb.ruang_lingkup)
    .put('/permohonan/update', auth, sppb.update_permohonan_awal)
    .put('/nomor-sppb-psat/update', auth, sppb.update_nomor_sppb_psat)
    .put('/unit-produksi/update', auth, sppb.update_unit_produksi)
    .put('/ruang-lingkup/update', auth, sppb.update_ruang_lingkup)
    .delete('/unit-produksi/delete', auth, sppb.delete_unit_produksi)
    .delete('/ruang-lingkup/delete', auth, sppb.delete_ruang_lingkup)
    .get('/permohonan/detail', auth, sppb.get_permohonan_awal)
    .get('/unit-produksi/detail', auth, sppb.get_unit_produksi)
    .get('/ruang-lingkup/detail', auth, sppb.get_ruang_lingkup)
    .get('/list-unit-produksi/detail', auth, sppb.get_list_unit_produksi)
    .get('/list-ruang-lingkup/detail', auth, sppb.get_list_ruang_lingkup)
    .get('/history', auth, sppb.get_history_pengajuan)
    .get('/history_pagination', auth, sppb.get_history_pengajuan_pagination)
    .get('/all/history', auth, sppb.get_history_all_sppb)


module.exports = Router;