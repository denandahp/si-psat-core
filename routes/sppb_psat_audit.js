const Router = require('express').Router();
const audit = require('../controllers/sppb_psat_audit.js');


Router.post('/audit/penunjukkan_auditor', audit.penunjukkan_auditor)
<<<<<<< HEAD
      .post('/audit/verifikasi_pvtpp', audit.verifikasi_pvtpp)
      .post('/audit/permohonan_baru', audit.permohonan_baru)
      .post('/audit/dokumen', audit.audit_dokumen)
      .post('/audit/lapang', audit.audit_lapang)
      .post('/audit/penunjukkan_tim_komtek', audit.penunjukkan_tim_komtek)
      .post('/audit/rekomendasi', audit.audit_rekomendasi)
      .post('/audit/pembayaran_pnbp', audit.pembayaran_pnbp)
      .post('/audit/ditolak', audit.dokumen_ditolak)
      .get('/audit/history', audit.audit_history)
      .get('/audit/history-sppb-psat', audit.history_pengajuan_sppb_psat)
=======
    .post('/audit/permohonan_baru', audit.permohonan_baru)
    .post('/audit/dokumen', audit.audit_dokumen)
    .post('/audit/lapang', audit.audit_lapang)
    .post('/audit/penunjukkan_tim_komtek', audit.penunjukkan_tim_komtek)
    .post('/audit/rekomendasi', audit.audit_rekomendasi)
    .post('/audit/pembayaran_pnbp', audit.pembayaran_pnbp)
    .post('/audit/ditolak', audit.dokumen_ditolak)
    .get('/audit/history', audit.audit_history)
    .get('/audit/history-sppb-psat', audit.history_pengajuan_sppb_psat)
>>>>>>> 79e7174ace607a29185fc82287277a3bc9a581cd


module.exports = Router;