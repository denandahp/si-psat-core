const Router = require('express').Router();
const summary = require('../controllers/summary.js');


Router.get('/sppb-psat', summary.getSummarySPPB)
    .get('/izin-edar', summary.getSummaryIzinEdar)




module.exports = Router;