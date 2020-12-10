import { expect } from 'chai';
import { HTTPError } from 'got';
import nock from 'nock';
import Log2Splunk from '../src';

describe('sendRaw', () => {
  it('should get 200 ok', async () => {
    const logger = new Log2Splunk({
      host: 'splunk-hec.example.com',
      token: 'aaaa',
    });

    let reqBody;

    nock('https://splunk-hec.example.com:8088', {
      reqheaders: {
        authorization: 'Splunk aaaa',
      },
    })
      .post('/services/collector/event', (body) => (reqBody = body))
      .reply(200, { text: 'Success', code: 0 });

    const result = await logger.sendRaw('Hello world');

    expect(reqBody).to.eq('Hello world');
    expect(result.statusCode).to.eq(200);
    expect(result.body).to.deep.equal({ text: 'Success', code: 0 });
  });
});
