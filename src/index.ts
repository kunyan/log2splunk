import got, { Response, HTTPSOptions, ExtendOptions } from 'got';
import { v4 as uuidv4 } from 'uuid';

export interface ILog2SplunkOptions {
  token?: string;
  protocol?: string;
  host?: string;
  port?: number;
  path?: string;
  source?: string;
  index?: string;
  https?: HTTPSOptions;
}

/**
 * @name Metadata
 * @description
 * @doc
 */
export interface IMetadata {
  time?: number;
  host?: string;
  source?: string;
  sourcetype?: string;
  index?: string;
  // https://docs.splunk.com/Documentation/Splunk/8.1.0/Data/IFXandHEC
  fields?: Record<string, string | string[]>;
}

interface IPayload extends IMetadata {
  event?: string | Record<string, unknown>;
}

const defaultOptions: ILog2SplunkOptions = {
  protocol: 'https',
  host: 'localhost',
  port: 8088,
  path: '/services/collector',
};

export default class Log2Splunk {
  private client;
  private metaData: IMetadata;

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
      prefixUrl: `${protocol}://${host}:${port}${path}`,
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
    metadata?: IMetadata
  ): IPayload {
    const payload: IPayload = {
      ...this.metaData,
      time: Math.floor(new Date().getTime() / 1000),
      event: body,
    };

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
    metadata?: IMetadata
  ): Promise<Response<T>> {
    const payload = this.getPayload(body, metadata);

    return this.client.post<T>('event', {
      json: payload,
    });
  }

  public async sendRaw(body: string): Promise<Response<string>> {
    return this.client.post('raw', {
      body,
      headers: {
        'X-Splunk-Request-Channel': uuidv4(),
      },
    });
  }
}
