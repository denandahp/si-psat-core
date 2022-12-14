const Router = require('express').Router();
const generatePdf = require('../controllers/utils/generatePdf.js')
const oss_license = require('../controllers/oss')
const auth = require('../middleware/auth.js');

Router.post('/sppb-psat/:id_pengguna/:id_pengajuan', auth, generatePdf.sppb_psat);
Router.post('/psat-pl/:id_pengguna/:id_pengajuan', auth, generatePdf.psat_pl);

Router.get('/sppb-psat/:id_pengguna/:id_pengajuan', auth, generatePdf.sppb_psat);
Router.get('/psat-pl/:id_pengguna/:id_pengajuan', auth, generatePdf.psat_pl);

module.exports = Router;