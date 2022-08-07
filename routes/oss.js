const Router = require('express').Router();
const oss = require('../controllers/oss.js');
const auth = require('../middleware/auth.js');


Router.get('/user/pelaku_usaha', auth, oss.pelaku_usaha)
    .get('/user/user_key', auth, oss.generate_key)
    .get('/list_izin', auth, oss.index_izin_oss)
    .get('/validate_token', auth, oss.validate_token)
    .get('/validate_izin', auth, oss.validate_id_izin)
    .post('/receiveNIB', auth, oss.receive_nib)
    .post('/send_license', auth, oss.send_license)
    .post('/send_license_status/:no_identitas/:id_izin', auth, oss.send_license_status)
    .post('/send_fileDS', auth, oss.send_fileDS)
    .post('/send_license_final', auth, oss.send_license_final)
    //   .POST('/sertifikat/NIB', oss.pelaku_usaha)



module.exports = Router;