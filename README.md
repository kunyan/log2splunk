# log2splunk

Log to Splunk

[![Build Status](https://github.com/kunyan/log2splunk/workflows/Build/badge.svg)](https://github.com/kunyan/log2splunk/actions)
[![codecov](https://codecov.io/gh/kunyan/log2splunk/branch/main/graph/badge.svg?token=KFDF83NVCR)](https://codecov.io/gh/kunyan/log2splunk)
[![npm version](https://img.shields.io/npm/v/log2splunk)](https://www.npmjs.com/package/log2splunk)

### Usage

```js
const Log2Splunk = require('log2splunk');

const logger = new Log2Splunk({
  token: "your-token",
  host: "splunk-hec.example.com"
});

// Send string
logger.send("Hello World");

// Send json
logger.send({
  message: "Hello World";
});


// Send Raw
logger.sendRaw("Hello World");

```

#### Async/Await

```js
//
(async () => {
  await logger.send('Hello async/await');
})();
```
