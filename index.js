const http = require('http');
const https = require('https');
const URL = require('url');

const invalidURI = (uri) => {
  return !(uri.protocol && (uri.protocol == 'http:' || uri.protocol == 'https:') && uri.hostname);
};

const get = (uri, opts = {}) => {
  const uri_o = URL.parse(uri);
  if (invalidURI(uri_o)) {
    return new Error(`Invalid URL: ${uri_o.href}`);
  }

  const options = {
    stream: (opts.stream !== undefined) ? opts.stream : false,
    maxRedirects: (opts.maxRedirects !== undefined) ? opts.maxRedirects : 10,
    redirects: (opts.redirects !== undefined) ? opts.redirects : 0,
    followRedirects: (opts.followRedirects !== undefined) ? opts.followRedirects : true,
    headers: {},
  };
  
  for (const header in opts.headers) {
    if (typeof opts.headers[header] !== undefined) {
      options.headers[header] = opts.headers[header];
    }
  }

  options.headers = {
    ...options.headers,
    'user-agent': 'https://github.com/joshuaferr1s/request-get',
  };

  return new Promise((resolve, reject) => {
    const fn = uri_o.protocol === 'http:' ? http : https;

    fn
      .get({...uri_o, headers: options.headers}, (res) => {
        if (res.statusCode < 400 && res.statusCode >= 300) {
          options.redirects += 1;
          console.log(options);
          if (!options.followRedirects) {
            return reject(new Error(`Following redirects is not enabled for this request. ${uri}`));
          }
          if (!res.headers.location) {
            return reject(new Error(`No new location was provided for the redirect. ${uri}`));
          }
          if (options.redirects >= options.maxRedirects) {
            return reject(new Error(`Exceeded maxRedirects. Probably stuck in a redirect loop ${uri}`));
          }
          return resolve(get(res.headers.location, options));
        }

        let chunks = [];
        let len = 0;

        if (options.stream) return resolve(res);

        res
          .on('data', (chunk) => {
            chunks.push(chunk);
            len += chunk.length;
          })
          .once('end', () => {
            let data = Buffer.concat(chunks, len);
            data = data.toString('utf8');
            res.body = data;
            return resolve(res);
          });
    });
  });
};

module.exports = get;
