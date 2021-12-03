const Router = require('express').Router();
const audit = require('../controllers/sppb_psat_audit.js');


Router.post('/audit/penunjukkan_auditor', audit.penunjukkan_auditor)
      .post('/audit/dokumen', audit.audit_dokumen)
      .post('/audit/lapang', audit.audit_lapang)
      .post('/audit/penunjukkan_tim_komtek', audit.penunjukkan_tim_komtek)
      .post('/audit/rekomendasi', audit.audit_rekomendasi)
      .get('/audit/history', audit.audit_history)

module.exports = Router;