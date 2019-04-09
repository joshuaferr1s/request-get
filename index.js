const http = require('http');
const https = require('https');
const URL = require('url');

const invalidURI = (uri) => {
  return !(uri.protocol && (uri.protocol == 'http:' || uri.protocol == 'https:') && uri.hostname);
};

let redirects = 0;

const get = (uri, options = {}) => {
  const uri_o = URL.parse(uri);
  if (invalidURI(uri_o)) {
    return new Error(`Invalid URL: ${uri_o.href}`);
  }
  if (uri_o.protocol === 'http:') {
    return new Promise((resolve, reject) => {
      http
        .get(uri_o, (res) => {
          if (res.statusCode === 302 && redirects < 10) {
            redirects += 1;
            return resolve(get(res.headers.location));
          } else {
            redirects = 0;
            return resolve(res);
          }
        })
        .on('error', (e) => reject(e));
    });
  } else {
    return new Promise((resolve, reject) => {
      https
        .get(uri_o, (res) => {
          if (res.statusCode === 302 && redirects < 10) {
            redirects += 1;
            return resolve(get(res.headers.location));
          } else {
            redirects = 0;
            return resolve(res);
          }
        })
        .on('error', (e) => reject(e));
    });
  }
};

module.exports = get;
