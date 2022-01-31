const Router = require('express').Router();
const audit = require('../controllers/psat_pl_audit.js');


Router.post('/audit/penunjukkan_auditor', audit.penunjukkan_auditor)
      .post('/audit/verifikasi_pvtpp', audit.verifikasi_pvtpp)
      .post('/audit/permohonan_baru', audit.permohonan_baru)
      .post('/audit/dokumen', audit.audit_dokumen)
      .post('/audit/penunjukkan_tim_komtek', audit.penunjukkan_tim_komtek)
      .post('/audit/rekomendasi', audit.audit_rekomendasi)
      .post('/audit/pembayaran_pnbp', audit.pembayaran_pnbp)
      .post('/audit/ditolak', audit.dokumen_ditolak)
      .get('/audit/history', audit.audit_history)
      .get('/audit/history-izin-edar', audit.history_pengajuan_izin_edar)


module.exports = Router;