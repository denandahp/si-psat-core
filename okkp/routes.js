const Router = require('express').Router();

const okkp_import = require('./imports/routes.js');
const okkp_export = require('./exports/routes.js');
const okkp_registrations = require('./registrations/routes.js');
const okkp_static = require('./static/routes')
const okkp_dashboard = require('./dashboard/routes')
const okkp_sync_data = require('./sync_data/routes.js')
const okkp_uji_lab = require('./uji_lab/routes.js')
const okkp_rapid_test = require('./rapid_test/routes.js')
const okkp_ratings = require('./ratings/routes.js')


Router.use('/imports', okkp_import)
Router.use('/exports', okkp_export)
Router.use('/registrations', okkp_registrations)
Router.use('/static', okkp_static)
Router.use('/dashboard', okkp_dashboard)
Router.use('/sync_data', okkp_sync_data)
Router.use('/uji_lab', okkp_uji_lab)
Router.use('/rapid_test', okkp_rapid_test)
Router.use('/ratings', okkp_ratings)

module.exports = Router;