

module.exports = {
    recaptcha: {
        client_key: process.env.RECAPTCHA_CLIENTKEY,
        secret_key: process.env.RECAPTCHA_SECRETKEY,
        options: {h1: 'fa'}
    },
    google: {
        client_key: process.env.GOOGLE_CLIENTKEY,
        secret_key: process.env.GOOGLE_SECRETKEY,
        callback_url: process.env.GOOGLE_CALLBACKURL
    }
}