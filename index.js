const http = require('http');
const https = require('https');
const URL = require('url');

const invalidURI = (uri) => {
  return !(uri.protocol && (uri.protocol == 'http:' || uri.protocol == 'https:') && uri.hostname);
};

const get = (uri) => {
  const uri_o = URL.parse(uri);
  if (invalidURI(uri_o)) {
    return new Error(`Invalid URL: ${uri_o.href}`);
  }
  if (uri_o.protocol === 'http:') {
    return new Promise((resolve, reject) => {
      http
        .get(uri_o, resolve)
        .on('error', (e) => reject(e));
    });
  } else {
    return new Promise((resolve, reject) => {
      https
        .get(uri_o, resolve)
        .on('error', (e) => reject(e));
    });
  }
};

module.exports = get;
