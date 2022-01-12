const Router = require('express').Router();
const summary = require('../controllers/summary.js');


Router.get('/sppb-psat/:jenis/:year/:month', summary.getSummarySPPB)
    .get('/izin-edar/:jenis/:year/:month', summary.getSummaryIzinEdar)
    .get('/permohonan/graph/:year', summary.getPermohonanByGraph)






module.exports = Router;