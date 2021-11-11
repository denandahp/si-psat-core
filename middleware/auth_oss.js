
const oss_param = require('../models/param/oss.js');

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

    let idToken, user_key;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        console.log('Found "Authorization" header');
        // Read the ID Token from the Authorization header.
        idToken = req.headers.authorization.split('Bearer ')[1];
        if(req.headers.user_key){
            console.log('Found "user_key" header');
            user_key = req.headers.user_key;
        }
    } else if (req.cookies) {
        console.log('Found "__session" cookie');
        // Read the ID Token from cookie.
        idToken = req.cookies.__session;
    } else {

        // No cookie
        res.status(403).send('Unauthorized');
        return;
    }

    try {
        const url = 'https://api-prd.oss.go.id/v1/sso/users/validate-token';
        const auth = 'Bearer ' + idToken;
        let validate_token_oss = await oss_param.validate_token(url, auth, user_key);
        req.user = validate_token_oss;
        next();
        return;

    } catch (error) {
        console.error('Error while verifying OSS ID token:', error.response.data);

        res.status(401).send(error.response.data);
        throw new Error("Unauthorized!");
        return;
    }
};