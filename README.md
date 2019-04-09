![bundlephobia request-get](https://badgen.net/bundlephobia/min/request-get)
![Semver request-get](https://img.shields.io/npm/v/request-get.svg)
![License request-get](https://img.shields.io/npm/l/request-get.svg)
# request-get

Do you need a super lightweight http get request with no extra fluff? Then you have found the right package! request-get does one thing and that is send get requests and give you the response right back. No configuration - just simple url entry gives you a response object. And did we mention it is promise based?

Right now a get request will follow a maximum of 10 redirects - at some point in the future this will be configurable by an options parameter.

## Examples

```js
const fs = require('fs');
const get = require('request-get');

(async () => {
  try {
    const response = await get('https://i.pinimg.com/originals/b5/75/ce/b575ceb9d9d16a3060c38ed211da4efb.jpg');
    console.log(`Status: ${response.statusCode} || Content Length: ${response.headers['content-length']}`);
    response.pipe(fs.createWriteStream('test.jpg'));
  } catch(e) {
    console.log(e);
  };
})();
```

Or using .then

```js
const fs = require('fs');
const get = require('request-get');

get('https://i.pinimg.com/originals/b5/75/ce/b575ceb9d9d16a3060c38ed211da4efb.jpg')
  .then((response) => {
    console.log(`Status: ${response.statusCode} || Content Length: ${response.headers['content-length']}`);
    response.pipe(fs.createWriteStream('test.jpg'));
  })
  .catch((e) => {
    console.log(e);
  });
```

Or in a simple request app

```js
const express = require('express');
const get = require('request-get');

const app = express();

app.get('/', async (req, res) => {
  const resp = get('https://thehorse.com/wp-content/uploads/2017/09/paint-horse-running-in-field.jpg');
  resp.pipe(res);
});

app.listen(3000);
```