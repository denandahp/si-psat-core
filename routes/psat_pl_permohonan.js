const Router = require('express').Router();
const pl = require('../controllers/psat_pl_permohonan.js');


Router.post('/permohonan/create', pl.permohonan_izin)
      .post('/unit-produksi/add', pl.add_unit_produksi)
      .post('/daftar-pemasok/add', pl.add_daftar_pemasok)
      .post('/daftar-pelanggan/add', pl.add_daftar_pelanggan)
      .post('/info-produk/add', pl.add_info_produk)
      .put('/nomor-sppb-psat/update', pl.update_nomor_izin_edar_pl)
      .put('/permohonan/update', pl.update_permohonan_izin)
      .put('/unit-produksi/update', pl.update_unit_produksi)
      .put('/daftar-pemasok/update', pl.update_daftar_pemasok)
      .put('/daftar-pelanggan/update', pl.update_daftar_pelanggan)
      .put('/info-produk/update', pl.update_info_produk)
      .delete('/unit-produksi/delete', pl.delete_unit_produksi)
      .delete('/daftar-pemasok/delete', pl.delete_daftar_pemasok)
      .delete('/daftar-pelanggan/delete', pl.delete_daftar_pelanggan)
      .delete('/info-produk/delete', pl.delete_info_produk)
      .get('/unit-produksi/detail', pl.get_unit_produksi)
      .get('/daftar-pemasok/detail', pl.get_daftar_pemasok)
      .get('/daftar-pelanggan/detail', pl.get_daftar_pelanggan)
      .get('/info-produk/detail', pl.get_info_produk)
      .get('/permohonan/detail', pl.get_permohonan_izin)
      .get('/list-unit-produksi/detail', pl.get_list_unit_produksi)
      .get('/list-daftar-pemasok/detail', pl.get_list_daftar_pemasok)
      .get('/list-daftar-pelanggan/detail', pl.get_list_daftar_pelanggan)
      .get('/list-info-produk/detail', pl.get_list_info_produk)



module.exports = Router;