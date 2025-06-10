const request = require('request');

module.exports.request = (options) =>
    new Promise((resolve, reject) => {
        request({ strictSSL: false, ...options }, (err, resp, body) => {
            if (err) return reject(err);
            return resolve(body);
        });
    });
