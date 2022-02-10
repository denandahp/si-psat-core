
const dotenv = require('dotenv');
const oss_param = require('../models/param/oss.js');

dotenv.config();

module.exports = auth = async(req, res, next) => {
    console.log('Check if request is authorized with OSS ID token');

    if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
        !(req.cookies && req.cookies.__session)) {
        console.error('No OSS token was passed as a Bearer token in the Authorization header.',
            'Make sure you authorize your request by providing the following HTTP header:',
            'Authorization: Bearer <OSS Token>',
            'or by passing a "__session" cookie.');
        res.status(403).send('Unauthorized');
        return;
    }

    let access_token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        console.log('Found "Authorization" header');
        // Read the ID Token from the Authorization header.
        access_token = req.headers.authorization.split('Bearer ')[1];
    } else if (req.cookies) {
        console.log('Found "__session" cookie');
        // Read the ID Token from cookie.
        access_token = req.cookies.__session;
    } else {

        // No cookie
        res.status(403).send('Unauthorized');
        return;
    }

    try {
        const url = `${process.env.MIDOSS_URL}/validateToken`;
        const x_sm_key = process.env.X_SM_KEY
        const token = await oss_param.generate_token('validate')
        const username = process.env.OSS_USERNAME
        let kd_izin = req.query.kd_izin
        let validate_token_oss = await oss_param.validate_token(url, access_token, token, x_sm_key, username, kd_izin);
        if (validate_token_oss.OSS_result.status == 401){
            return res.status(401).send({
                auth: false,
                message: validate_token_oss.OSS_result.message,
                detail: validate_token_oss.OSS_result
            });
        } else if (validate_token_oss.status == false){
            return res.status(401).send({
                auth: false,
                message: validate_token_oss.message,
                detail: validate_token_oss
            });
        }
        req.validateToken = validate_token_oss;
        next();
        return;

    } catch (error) {
        console.error('Error while verifying OSS ID token:', error.response.data);

        res.status(401).send(error.response.data);
        throw new Error("Unauthorized!");
    }
};