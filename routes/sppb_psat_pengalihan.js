const Router = require('express').Router();
const sppb = require('../controllers/sppb_psat_pengalihan.js');
const auth = require('../middleware/auth.js');


Router.post('/pengalihan/create', auth, sppb.pengalihan_kepemilikan)
    .put('/pengalihan/update', auth, sppb.update_pengalihan_kepemilikan)
    .put('/pengalihan/nomor-sppb-psat/update', auth, sppb.update_nomor_sppb_psat)
    .get('/pengalihan/detail', auth, sppb.get_pengalihan_kepemilikan)
    //--------------- sudah tidak dipakai-----------------------------------
    .post('/pengalihan/unit-produksi/add', auth, sppb.add_pengalihan_unit_produksi)
    .post('/pengalihan/info-perusahaan/add', auth, sppb.add_pengalihan_info_perusahaan)
    .put('/pengalihan/unit-produksi/update', auth, sppb.update_pengalihan_unit_produksi)
    .put('/pengalihan/info-perusahaan/update', auth, sppb.update_pengalihan_info_perusahaan)
    .delete('/pengalihan/unit-produksi/delete', auth, sppb.delete_pengalihan_unit_produksi)
    .delete('/pengalihan/info-perusahaan/delete', auth, sppb.delete_pengalihan_info_perusahaan)
    .get('/pengalihan/unit-produksi/detail', auth, sppb.get_pengalihan_unit_produksi)
    .get('/pengalihan/info-perusahaan/detail', auth, sppb.get_pengalihan_info_perusahaan)
    .get('/pengalihan/list-unit-produksi/detail', auth, sppb.get_list_pengalihan_unit_produksi)




module.exports = Router;