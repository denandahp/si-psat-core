const Router = require('express').Router();
const pl = require('../controllers/psat_pl_perubahan.js');
const auth = require('../middleware/auth.js');


Router.post('/perubahan/create', auth, pl.perubahan_data)
      .post('/perubahan/unit-produksi/add', auth, pl.add_perubahan_unit_produksi)
      .post('/perubahan/info-produk/add', auth, pl.add_perubahan_info_produk)
      .put('/perubahan/update', pl.update_perubahan_data)
      .put('/perubahan/unit-produksi/update', auth, pl.update_perubahan_unit_produksi)
      .put('/perubahan/info-produk/update', auth, pl.update_perubahan_info_produk)
      .delete('/perubahan/unit-produksi/delete', auth, pl.delete_perubahan_unit_produksi)
      .delete('/perubahan/info-produk/delete', auth, pl.delete_perubahan_info_produk)
      .get('/perubahan/detail', auth, pl.get_perubahan_data)




module.exports = Router;