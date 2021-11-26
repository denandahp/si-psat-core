const debug = require('debug')('app:server');
const session = require('cookie-session');
const express = require('express');
const app = express();
const morgan = require('morgan');
const logger = require('morgan');
const server = require('http').Server(app);
const bodyParser = require('body-parser');
const CONFIG_FILE_PATH = __dirname + '/configs.json';
const config = require(CONFIG_FILE_PATH);
const path = require('path');
const cors = require('cors');

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    debug('Server Started. *:%o', PORT);
});

// Views setting
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Body Parser
app.use(morgan('tiny'));
app.use(logger('dev'));
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000
}));

//Simple Usage (Enable All CORS Requests)
app.use(cors())
// app.get('/products/:id', function (req, res, next) {
//   res.json({msg: 'This is CORS-enabled for all origins!'})
// })
// app.listen(80, function () {
//   console.log('CORS-enabled web server listening on port 80')
// })

//Static image
app.use(express.static(path.join(__dirname, 'uploads')));

// cookie-session
app.set('trust proxy', 1); // trust first proxy

app.use(session(config.cookies));

// MaxAge
app.use(function SessionMaxAgeMiddleware(req, res, next) {
    req.sessionOptions.maxAge = req.session.maxAge || req.sessionOptions.maxAge;
    next();
});

// locals.
app.use(function LocalsMiddleware(req, res, next) {

    res.locals.edit = false;
    res.locals.user = req.session.user || false;

    next();
});

// All controllers should live here
app.get("/", function rootHandler(req, res) {
    res.end("Hello world!");
});

const index = require('./routes/index.js');
const user = require('./routes/user.js');
const sppb_psat_penambahan = require('./routes/sppb_psat_penambahan.js');
const sppb_psat_pengalihan = require('./routes/sppb_psat_pengalihan.js');
const sppb_psat_permohonan = require('./routes/sppb_psat_permohonan.js');
const sppb_psat_perpanjangan = require('./routes/sppb_psat_perpanjangan.js');
const past_pl_pengalihan = require('./routes/psat_pl_pengalihan.js');
const past_pl_permohonan = require('./routes/psat_pl_permohonan.js');
const past_pl_perubahan = require('./routes/psat_pl_perubahan.js');
const oss = require('./routes/oss.js');
const upload_file = require('./routes/upload.js');
const sertifikat = require('./routes/sertifikat.js');

app.use('/', index);
app.use('/api/user', user);
app.use('/api/psat/sppb', sppb_psat_penambahan)
app.use('/api/psat/sppb', sppb_psat_pengalihan)
app.use('/api/psat/sppb', sppb_psat_permohonan)
app.use('/api/psat/sppb', sppb_psat_perpanjangan)
app.use('/api/psat/pl', past_pl_pengalihan)
app.use('/api/psat/pl', past_pl_permohonan)
app.use('/api/psat/pl', past_pl_perubahan)
app.use('/api/oss', oss)
app.use('/api/upload', upload_file)
app.use('/api/sertifikat', sertifikat);


// Error Middleware
app.use(require('./libs/error.js'));