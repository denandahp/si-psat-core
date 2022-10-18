const Router = require('express').Router();
const controllers = require('./controllers.js');
const auth = require('../../middleware/auth.js')

Router.get('', auth, controllers.index_uji_lab)
      .get('/detail', auth, controllers.detail_uji_lab)
      .post('/add', auth, controllers.create_uji_lab)
      .put('/update', auth, controllers.update_uji_lab)
      .delete('/delete', auth, controllers.delete_uji_lab)
module.exports = Router;