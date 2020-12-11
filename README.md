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

// Send with metadata
logger.send("Hello World", {
  source: 'my-app',
  sourcetype: '_raw'
})


// Send Raw
logger.sendRaw("Hello World");

```

#### Options

| Name       | Description                                                                                            | Type                | Default                    |
| ---------- | ------------------------------------------------------------------------------------------------------ | ------------------- | -------------------------- |
| `token`    | The Splunk HEC token, required                                                                         | `String`            | null                       |
| `protocol` | The Splunk HEC protocol                                                                                | `http` \|\| `https` | `https`                    |
| `host`     | The Splunk HEC host                                                                                    | `String`            | `localhost`                |
| `port`     | The Splunk HEC port                                                                                    | `Number`            | `8088`                     |
| `path`     | The Splunk HEC path                                                                                    | `String`            | `/services/collector`      |
| `source`   | Then event source                                                                                      | `String`            | `log2splunk`               |
| `index`    | The event index                                                                                        | `String`            | Extend your HEC token info |
| `https`    | The https config, more info in [https options](https://github.com/sindresorhus/got#advanced-https-api) | `Object`            | null                       |

#### Metadata

| Name         | Description                                                                                                                                                                                                                                                                                                                                                                | Type                                                  | Default     |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ----------- |
| `time`       | The event time in epoch time, in the format `\<sec\>`.`\<ms\>`. For example, `1433188255.500` indicates 1433188255 seconds and 500 milliseconds after epoch, or Monday, June 1, 2015, at 7:50:55 PM GMT.                                                                                                                                                                   | `Number`                                              | now         |
| `host`       | The `host` value to assign to the event data. This is typically the hostname of the client from which you're sending data.                                                                                                                                                                                                                                                 | `String`                                              |             |
| `source`     | The `source` value to assign to the event data. For example, if you're sending data from an app you're developing, you could set this key to the name of the app.                                                                                                                                                                                                          | `String`                                              |             |
| `sourcetype` | The `sourcetype` value to assign to the event data.                                                                                                                                                                                                                                                                                                                        | `String`                                              | `httpevent` |
| `index`      | The name of the index by which the event data is to be indexed. The index you specify here must be within the list of allowed indexes if the token has the `indexes` parameter set.                                                                                                                                                                                        | `String`                                              |             |
| `fields`     | (Not applicable to raw data.) Specifies a JSON object that contains explicit custom fields to be defined at index time. Requests containing the `"fields"` property must be sent to the `/collector/event` endpoint, or they will not be indexed. For more information, see [Indexed field extractions](http://docs.splunk.com/Documentation/Splunk/8.1.0/Data/IFXandHEC). | `String` or `Object<String, String \| Array<String>>` |             |

#### Async/Await

```js
(async () => {
  await logger.send('Hello async/await');
})();
```

### Reference

[HTTP Event Collector Examples](https://docs.splunk.com/Documentation/Splunk/8.1.0/Data/HECExamples)
