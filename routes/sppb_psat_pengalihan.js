const Router = require('express').Router();
const sppb = require('../controllers/sppb_psat_pengalihan.js');


Router.post('/pengalihan/create', sppb.pengalihan_kepemilikan)
    .put('/pengalihan/update', sppb.update_pengalihan_kepemilikan)
    .put('/pengalihan/nomor-sppb-psat/update', sppb.update_nomor_sppb_psat)
    .get('/pengalihan/detail', sppb.get_pengalihan_kepemilikan)
    //--------------- sudah tidak dipakai-----------------------------------
    .post('/pengalihan/unit-produksi/add', sppb.add_pengalihan_unit_produksi)
    .post('/pengalihan/info-perusahaan/add', sppb.add_pengalihan_info_perusahaan)
    .put('/pengalihan/unit-produksi/update', sppb.update_pengalihan_unit_produksi)
    .put('/pengalihan/info-perusahaan/update', sppb.update_pengalihan_info_perusahaan)
    .delete('/pengalihan/unit-produksi/delete', sppb.delete_pengalihan_unit_produksi)
    .delete('/pengalihan/info-perusahaan/delete', sppb.delete_pengalihan_info_perusahaan)
    .get('/pengalihan/unit-produksi/detail', sppb.get_pengalihan_unit_produksi)
    .get('/pengalihan/info-perusahaan/detail', sppb.get_pengalihan_info_perusahaan)
    .get('/pengalihan/list-unit-produksi/detail', sppb.get_list_pengalihan_unit_produksi)




module.exports = Router;