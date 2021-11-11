const errorUtils = require('./error');

const getCookies = (req) => {
    return req.cookies;
}

exports.processRequestWithJWT = (req, callback, fallback) => {
    // let cookies = getCookies(req);
    // if ('jwt' in cookies) {
    //     fallback(errorUtils.getErrorTemplate('Sesi berakhir. Mohon login ulang.'));
    // } else {
    callback();
    // }
}

exports.processGETRequestError = () => {
    return errorUtils.getErrorTemplate('Gagal mendapatkan data');
}

exports.processPOSTRequestError = () => {
    return errorUtils.getErrorTemplate('Gagal mengirimkan data');
}

exports.processDELETERequestError = () => {
    return errorUtils.getErrorTemplate('Gagal menghapus data');
}

exports.processPUTRequestError = () => {
    return errorUtils.getErrorTemplate('Gagal menyunting data');
}

exports.processRegistrationError = (error) => {
    if (error.code === '23505') {
        if (error.detail.includes('username')) {
            return errorUtils.getErrorTemplate(`Username telah digunakan.`);
        } else {
            return errorUtils.getDefaultError();
        }
    } else {
        if (error.config.url === 'https://teras.wablas.com/api/send-message') {
            console.log(error.response.data);
            return errorUtils.getErrorTemplate("Gagal mengirim pesan WhatsApp, namun Anda telah terdaftar. Mohon hubungi pihak Rasyiidu untuk mendapatkan password");
        } else {
            console.log(error);
            return errorUtils.getDefaultError();
        }
    }
}

exports.processLoginError = (error) => {
    return errorUtils.getErrorTemplate(`${error.message} Mohon coba lagi.`);
}