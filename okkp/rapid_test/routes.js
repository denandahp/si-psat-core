const Router = require('express').Router();
const controllers = require('./controllers.js');
const auth = require('../../middleware/auth.js')

Router.get('', auth, controllers.index_rapid_test)
      .get('/detail', auth, controllers.detail_rapid_test)
      .post('/add', auth, controllers.create_rapid_test)
      .put('/update', auth, controllers.update_rapid_test)
      .delete('/delete', auth, controllers.delete_rapid_test)
module.exports = Router;