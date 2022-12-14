const Router = require('express').Router();
const auth = require('../middleware/auth.js')
const user = require('../controllers/user.js');

Router.post('/login', user.login)
      .post('/logout', user.logout)
      .post('/register/pelaku_usaha', user.register_pelaku_usaha)
      .post('/register/auditor', user.register_auditor)
      .post('/register/tim_komtek', user.register_tim_komtek)
      .post('/register/superadmin', user.register_superadmin)
      .put('/edit/pelaku_usaha', auth, user.update_pelaku_usaha)
      .put('/edit/auditor', auth, user.update_auditor)
      .put('/edit/tim_komtek', auth, user.update_tim_komtek)
      .put('/edit/superadmin', auth, user.update_superadmin)
      .delete('/delete/sekretariat', auth, user.delete_sekretariat)
      .get('/index/sekretariat', auth, user.index_sekretariat)
      .get('/index/pelaku_usaha', auth, user.index_pelaku_usaha)
      .get('/detail/pelaku_usaha', auth, user.detail_pelaku_usaha)


module.exports = Router;