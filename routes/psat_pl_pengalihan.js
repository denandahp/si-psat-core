const Router = require('express').Router();
const pl = require('../controllers/psat_pl_pengalihan.js');


Router.post('/pengalihan/create', pl.pengalihan_kepemilikan)
      .post('/pengalihan/unit-produksi/add', pl.add_pengalihan_unit_produksi)
      .post('/pengalihan/info-produk/add', pl.add_pengalihan_info_produk)
      .put('/pengalihan/unit-produksi/update', pl.update_pengalihan_unit_produksi)
      .put('/pengalihan/info-produk/update', pl.update_pengalihan_info_produk)
      .delete('/pengalihan/unit-produksi/delete', pl.delete_pengalihan_unit_produksi)
      .delete('/pengalihan/info-produk/delete', pl.delete_pengalihan_info_produk)


module.exports = Router;