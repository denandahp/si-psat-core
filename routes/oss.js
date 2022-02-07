const Router = require('express').Router();
const oss = require('../controllers/oss.js');
const auth_oss = require('../middleware/auth_oss.js')


Router.get('/user/pelaku_usaha', oss.pelaku_usaha)
    .get('/user/user_key', oss.generate_key)
    .get('/list_izin', oss.get_list_izin_oss)
    .get('/validate_token', oss.validate_token)
    .post('/receiveNIB', oss.receive_nib)
    .post('/send_license', oss.send_license)
    .post('/send_license_status', oss.send_license_status)
    .post('/send_fileDS', oss.send_fileDS)
    .post('/send_license_final', oss.send_license_final)
    //   .POST('/sertifikat/NIB', oss.pelaku_usaha)



module.exports = Router;