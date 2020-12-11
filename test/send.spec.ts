import { expect } from 'chai';
import { HTTPError } from 'got';
import nock from 'nock';
import Log2Splunk from '../src';

describe('send', () => {
  it('should get 200 ok', async () => {
    const logger = new Log2Splunk({
      host: 'splunk-hec.example.com',
      token: 'aaaa',
      https: {
        rejectUnauthorized: true,
      },
    });

    let reqBody;

    nock('https://splunk-hec.example.com:8088', {
      reqheaders: {
        authorization: 'Splunk aaaa',
      },
    })
      .post('/services/collector/event', (body) => (reqBody = body))
      .reply(200, { text: 'Success', code: 0 });

    const result = await logger.send('Hello world');

    expect(reqBody).to.deep.contains({
      event: 'Hello world',
    });

    expect(result.statusCode).to.eq(200);
    expect(result.body).to.deep.equal({ text: 'Success', code: 0 });
  });

  it('should get 200 when send json event', async () => {
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

    const result = await logger.send(
      {
        message: 'Hello world',
        severity: 'info',
      },
      { source: 'unit test' }
    );

    expect(reqBody).to.deep.contains({
      event: {
        message: 'Hello world',
        severity: 'info',
      },
      source: 'unit test',
    });
    expect(result.statusCode).to.eq(200);
    expect(result.body).to.deep.equal({ text: 'Success', code: 0 });
  });

  it('should get invalid token error ', async () => {
    const logger = new Log2Splunk({
      host: 'splunk-hec.example.com',
      token: 'bbbbbb',
    });

    nock('https://splunk-hec.example.com:8088', {
      reqheaders: {
        authorization: 'Splunk bbbbbb',
      },
    })
      .post('/services/collector/event')
      .reply(401, { text: 'Invalid token', code: 4 });

    await logger.send('Hello Error').catch((err: HTTPError) => {
      expect(err.response.statusCode).to.eq(401);
      expect(err.response.body).to.deep.equal({
        text: 'Invalid token',
        code: 4,
      });
    });
  });

  it('should get error if token not provided', async () => {
    const logger = new Log2Splunk();
    await logger.send('Hello Error').catch((err: Error) => {
      expect(err).to.be.an('error');
      expect(err.message).to.eq('Token required');
    });
  });
});
