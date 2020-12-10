# log2splunk

Log to Splunk

![Build](https://github.com/kunyan/log4splunk/workflows/node.js/badge.svg)

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
