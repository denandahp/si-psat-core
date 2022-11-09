const Router = require('express').Router();
const controllers = require('./controllers.js');
const auth = require('../../middleware/auth.js')

Router.get('', auth, controllers.index_sdm)
      .get('/detail', auth, controllers.detail_sdm)
      .post('/add', auth, controllers.create_sdm)
      .put('/update', auth, controllers.update_sdm)
      .delete('/delete', auth, controllers.delete_sdm)
module.exports = Router;