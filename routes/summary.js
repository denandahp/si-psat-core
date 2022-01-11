const Router = require('express').Router();
const summary = require('../controllers/summary.js');


Router.get('/sppb-psat/ongoing', summary.getSummarySPPB)
    .get('/izin-edar/ongoing', summary.getSummaryIzinEdar)
    .get('/permohonan/graph/:year', summary.getPermohonanByGraph)





module.exports = Router;