const Router = require('express').Router();
const auth = require('../middleware/auth.js')
const user = require('../controllers/user.js');

Router.post('/login', user.login)
      .post('/logout', user.logout)
      .post('/register/pelaku_usaha', user.register_pelaku_usaha)
      .post('/register/auditor', user.register_auditor)
      .post('/register/tim_komtek', user.register_tim_komtek)
      .post('/register/superadmin', user.register_superadmin)
      .put('/edit/pelaku_usaha', user.update_pelaku_usaha)
      .put('/edit/auditor', user.update_auditor)
      .put('/edit/tim_komtek', user.update_tim_komtek)
      .put('/edit/superadmin', user.update_superadmin)
      .delete('/delete/sekretariat', user.delete_sekretariat)
      .get('/index/sekretariat', user.index_sekretariat)
      .get('/detail/pelaku_usaha', user.detail_pelaku_usaha)


module.exports = Router;