import {Method, BadResult} from '../types';

export class RequestError extends Error {
  status: number;
  method: Method;
  endpoint: string;
  body: string;

  constructor(status: number, method: Method, endpoint: string, body: string) {
    super(`unexpected response '${status}' from '${method}' '${endpoint}': ${body}`);
    this.status = status;
    this.method = method;
    this.endpoint = endpoint;
    this.body = body;

    // this allows using instanceof to narrow the type
    // see here for more details: https://stackoverflow.com/a/41429145/410286
    Object.setPrototypeOf(this, RequestError.prototype);
  }

  jsonError(): BadResult | undefined {
    try {
      return JSON.parse(this.body);
    } catch (_) {
      return;
    }
  }
}
