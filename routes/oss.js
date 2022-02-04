const Router = require('express').Router();
const oss = require('../controllers/oss.js');
const auth = require('../middleware/auth_oss.js')


Router.get('/user/pelaku_usaha', oss.pelaku_usaha)
    .get('/user/validate_token', oss.pelaku_usaha)
    .get('/user/user_key', oss.generate_key)
    .post('/receiveNIB', oss.receive_nib)
    .post('/send_license', oss.send_license)
    .post('/send_license_final', oss.send_license_final)
    //   .POST('/sertifikat/NIB', oss.pelaku_usaha)



module.exports = Router;