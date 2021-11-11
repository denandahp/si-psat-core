const Router = require('express').Router();
const sppb = require('../controllers/sppb_psat_perpanjangan.js');


Router.post('/perpanjangan/create', sppb.perpanjangan_masa_berlaku)
    


module.exports = Router;