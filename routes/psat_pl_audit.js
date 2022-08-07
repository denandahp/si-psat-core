const Router = require('express').Router();
const audit = require('../controllers/psat_pl_audit.js');
const auth = require('../middleware/auth.js');


Router.post('/audit/penunjukkan_auditor', auth, audit.penunjukkan_auditor)
    .post('/audit/permohonan_baru', auth, audit.permohonan_baru)
    .post('/audit/dokumen', auth, audit.audit_dokumen)
    .post('/audit/penunjukkan_tim_komtek', auth, audit.penunjukkan_tim_komtek)
    .post('/audit/rekomendasi', auth, audit.audit_rekomendasi)
    .post('/audit/pembayaran_pnbp', auth, audit.pembayaran_pnbp)
    .post('/audit/ditolak', auth, audit.dokumen_ditolak)
    .get('/audit/history', auth, audit.audit_history)
    .get('/audit/history-izin-edar', auth, audit.history_pengajuan_izin_edar)


module.exports = Router;