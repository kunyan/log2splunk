import got, { Response, HTTPSOptions, ExtendOptions } from 'got';

export interface ILog2SplunkOptions {
  token?: string;
  protocol: string;
  host: string;
  port: number;
  path: string;
  source?: string;
  index?: string;
  https?: HTTPSOptions;
}

export interface IMetaData {
  time?: number;
  host?: string;
  source?: string;
  sourcetype?: string;
  index?: string;
  fields?: Record<string, unknown>;
}

interface IPayload extends IMetaData {
  event?: string | Record<string, unknown>;
}

const defaultOptions: ILog2SplunkOptions = {
  protocol: 'https',
  host: 'localhost',
  port: 8088,
  path: '/services/collector/event',
};

export default class Log2Splunk {
  private client;
  private metaData: IMetaData;

  constructor(options: Partial<ILog2SplunkOptions> = defaultOptions) {
    const { protocol, host, port, path, token, https, source, index } = {
      ...defaultOptions,
      ...options,
    };

    this.metaData = {
      source,
      index,
    };

    const opt: ExtendOptions = {
      url: `${protocol}://${host}:${port}${path}`,
      context: {
        token,
      },
      headers: {
        'user-agent': `log2splunk`,
        authorization: `Splunk ${token}`,
      },
      responseType: 'json',
      hooks: {
        beforeRequest: [
          (options) => {
            if (!options.context || !options.context.token) {
              throw new Error('Token required');
            }
            options.headers.token = `Splunk ${options.context.token}`;
          },
        ],
      },
    };

    if (https) {
      opt.https = https;
    }

    this.client = got.extend(opt);
  }

  private getPayload(
    body: string | Record<string, unknown>,
    metadata?: IMetaData
  ): IPayload {
    const payload: IPayload = {
      ...this.metaData,
      time: Math.floor(new Date().getTime() / 1000),
    };

    if (typeof body === 'string') {
      payload.event = body;
      payload.sourcetype = '_raw';
    } else {
      payload.fields = body;
      payload.sourcetype = '_json';
    }
    if (metadata) {
      return {
        ...payload,
        ...metadata,
      };
    }

    return payload;
  }

  public async send<T>(
    body: string | Record<string, unknown>,
    metadata?: IMetaData
  ): Promise<Response<T>> {
    const payload = this.getPayload(body, metadata);

    return this.client.post<T>({
      json: payload,
    });
  }

  public async sendRaw(body: string): Promise<Response<string>> {
    return this.client.post({
      body,
    });
  }
}
