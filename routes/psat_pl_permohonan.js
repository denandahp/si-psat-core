const Router = require('express').Router();
const pl = require('../controllers/psat_pl_permohonan.js');
const auth = require('../middleware/auth.js');


Router.post('/permohonan/create', auth, pl.permohonan_izin)
    .post('/unit-produksi/add', auth, pl.add_unit_produksi)
    .post('/daftar-pemasok/add', auth, pl.add_daftar_pemasok)
    .post('/daftar-pelanggan/add', auth, pl.add_daftar_pelanggan)
    .post('/info-produk/add', auth, pl.add_info_produk)
    .put('/nomor-sppb-psat/update', auth, pl.update_nomor_izin_edar_pl)
    .put('/permohonan/update', auth, pl.update_permohonan_izin)
    .put('/unit-produksi/update', auth, pl.update_unit_produksi)
    .put('/daftar-pemasok/update', auth, pl.update_daftar_pemasok)
    .put('/daftar-pelanggan/update', auth, pl.update_daftar_pelanggan)
    .put('/info-produk/update', auth, pl.update_info_produk)
    .delete('/unit-produksi/delete', auth, pl.delete_unit_produksi)
    .delete('/daftar-pemasok/delete', auth, pl.delete_daftar_pemasok)
    .delete('/daftar-pelanggan/delete', auth, pl.delete_daftar_pelanggan)
    .delete('/info-produk/delete', auth, pl.delete_info_produk)
    .get('/unit-produksi/detail', auth, pl.get_unit_produksi)
    .get('/daftar-pemasok/detail', auth, pl.get_daftar_pemasok)
    .get('/daftar-pelanggan/detail', auth, pl.get_daftar_pelanggan)
    .get('/info-produk/detail', auth, pl.get_info_produk)
    .get('/permohonan/detail', auth, pl.get_permohonan_izin)
    .get('/list-unit-produksi/detail', auth, pl.get_list_unit_produksi)
    .get('/list-daftar-pemasok/detail', auth, pl.get_list_daftar_pemasok)
    .get('/list-daftar-pelanggan/detail', auth, pl.get_list_daftar_pelanggan)
    .get('/list-info-produk/detail', auth, pl.get_list_info_produk)
    .get('/history', auth, pl.get_history_pengajuan)

module.exports = Router;