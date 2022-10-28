const Router = require('express').Router();
const controllers = require('./controllers.js');

Router.get('', controllers.index_ratings)
      .get('/detail', controllers.detail_ratings)
      .post('/add', controllers.create_ratings)
      .put('/update', controllers.update_ratings)
      .delete('/delete', controllers.delete_ratings)
module.exports = Router;