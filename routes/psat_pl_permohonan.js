const Router = require('express').Router();
const pl = require('../controllers/psat_pl_permohonan.js');


Router.post('/permohonan/create', pl.permohonan_izin)
      .post('/unit-produksi/add', pl.add_unit_produksi)
      .post('/daftar-pemasok/add', pl.add_daftar_pemasok)
      .post('/daftar-pelanggan/add', pl.add_daftar_pelanggan)
      .post('/info-produk/add', pl.add_info_produk)
      .put('/unit-produksi/update', pl.update_unit_produksi)
      .put('/daftar-pemasok/update', pl.update_daftar_pemasok)
      .put('/daftar-pelanggan/update', pl.update_daftar_pelanggan)
      .put('/info-produk/update', pl.update_info_produk)
      .delete('/unit-produksi/delete', pl.delete_unit_produksi)
      .delete('/daftar-pemasok/delete', pl.delete_daftar_pemasok)
      .delete('/daftar-pelanggan/delete', pl.delete_daftar_pelanggan)
      .delete('/info-produk/delete', pl.delete_info_produk)


module.exports = Router;