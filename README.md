![bundlephobia request-get](https://badgen.net/bundlephobia/min/request-get)
![Semver request-get](https://img.shields.io/npm/v/request-get.svg)
![License request-get](https://img.shields.io/npm/l/request-get.svg)
# request-get

Do you need a super lightweight http get request with no extra fluff? Then you have found the right package! request-get does one thing and that is send get requests and give you the response right back. No configuration - just simple url entry gives you a response object. And did we mention it is promise based?

The following options object may be provided
```js
{
  stream: true/false,             // Default false
  maxRedirects: 0-X,              // Default 10
  followRedirects: true/false,    // Default true
  headers: {                      // Default {}
    HEADER: VALUE,
  },
};
```

## Examples

### Streams

```js
const fs = require('fs');
const get = require('request-get');

(async () => {
  try {
    const response = await get('https://i.pinimg.com/originals/b5/75/ce/b575ceb9d9d16a3060c38ed211da4efb.jpg', {stream: true});
    console.log(`Status: ${response.statusCode} || Content Length: ${response.headers['content-length']}`);
    response.pipe(fs.createWriteStream('test.jpg'));
  } catch(e) {
    console.log(e);
  };
})();
```

### JSON

```js
const get = require('request-get');

(async () => {
  try {
    const res = await get('https://api.github.com/repos/joshuaferr1s/request-get', {headers: {'User-Agent': 'request'}});
    console.log(res.statusCode);
    const json = JSON.parse(res.body);
    console.log(`request-get watchers on github: ${json.watchers}`);
  } catch(e) {
    console.log(e);
  };
})();
```
