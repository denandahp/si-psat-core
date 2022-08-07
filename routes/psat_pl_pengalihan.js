const Router = require('express').Router();
const pl = require('../controllers/psat_pl_pengalihan.js');
const auth = require('../middleware/auth.js');


Router.post('/pengalihan/create', auth, pl.pengalihan_kepemilikan)
      .post('/pengalihan/unit-produksi/add', auth, pl.add_pengalihan_unit_produksi)
      .post('/pengalihan/info-produk/add', auth, pl.add_pengalihan_info_produk)
      .put('/pengalihan/update', auth, pl.update_pengalihan_kepemilikan)
      .put('/pengalihan/unit-produksi/update', auth, pl.update_pengalihan_unit_produksi)
      .put('/pengalihan/info-produk/update', auth, pl.update_pengalihan_info_produk)
      .delete('/pengalihan/unit-produksi/delete', auth, pl.delete_pengalihan_unit_produksi)
      .delete('/pengalihan/info-produk/delete', auth, pl.delete_pengalihan_info_produk)
      .get('/pengalihan/detail', auth, pl.get_pengalihan_kepemilikan)



module.exports = Router;