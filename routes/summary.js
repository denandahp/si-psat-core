const Router = require('express').Router();
const summary = require('../controllers/summary.js');


Router.get('/sppb-psat/ongoing', summary.getSummarySPPB)
    .get('/izin-edar/ongoing', summary.getSummaryIzinEdar)




module.exports = Router;