const Router = require('express').Router();
const summary = require('../controllers/summary.js');
const auth = require('../middleware/auth.js');


Router.get('/sppb-psat/:jenis/:year/:month', auth, summary.getSummarySPPB)
    .get('/izin-edar/:jenis/:year/:month', auth, summary.getSummaryIzinEdar)
    .get('/permohonan/graph/:year', auth, summary.getPermohonanByGraph)
    .get('/downloadExcel/:filename/:jenis/:year/:month', auth, summary.sendExcel)

module.exports = Router;