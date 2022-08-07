const Router = require('express').Router();
const audit = require('../controllers/sppb_psat_audit.js');
const auth = require('../middleware/auth.js');


Router.post('/audit/penunjukkan_auditor', auth, audit.penunjukkan_auditor)
    .post('/audit/permohonan_baru', auth, audit.permohonan_baru)
    .post('/audit/dokumen', auth, audit.audit_dokumen)
    .post('/audit/lapang', auth, audit.audit_lapang)
    .post('/audit/penunjukkan_tim_komtek', auth, audit.penunjukkan_tim_komtek)
    .post('/audit/rekomendasi', auth, audit.audit_rekomendasi)
    .post('/audit/pembayaran_pnbp', auth, audit.pembayaran_pnbp)
    .post('/audit/ditolak', auth, audit.dokumen_ditolak)
    .get('/audit/history', auth, audit.audit_history)
    .get('/audit/history-sppb-psat', auth, audit.history_pengajuan_sppb_psat)


module.exports = Router;