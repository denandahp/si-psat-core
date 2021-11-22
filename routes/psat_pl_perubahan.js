const Router = require('express').Router();
const pl = require('../controllers/psat_pl_perubahan.js');


Router.post('/perubahan/create', pl.perubahan_data)
      .post('/perubahan/unit-produksi/add', pl.add_perubahan_unit_produksi)
      .post('/perubahan/info-produk/add', pl.add_perubahan_info_produk)
      .put('/perubahan/update', pl.update_perubahan_data)
      .put('/perubahan/unit-produksi/update', pl.update_perubahan_unit_produksi)
      .put('/perubahan/info-produk/update', pl.update_perubahan_info_produk)
      .delete('/perubahan/unit-produksi/delete', pl.delete_perubahan_unit_produksi)
      .delete('/perubahan/info-produk/delete', pl.delete_perubahan_info_produk)
      .get('/perubahan/detail', pl.get_perubahan_data)




module.exports = Router;