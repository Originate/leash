import {Method, Result} from './types';
import {RouteClient, RequestError} from './client';

export * from './types';

interface DataToEndpoint<Data> {
  (data: Data): string;
}

export function readCookie(documentCookie: string, cookieName: string): string | undefined {
  for (const cookie of documentCookie.split(';')) {
    const [name, value] = cookie.trim().split('=');
    if (name === cookieName) return value;
  }
  return undefined;
}

export async function jsonAction(
  method: Method,
  endpoint: string,
  body: unknown,
  readCookies: () => string,

  // this actually returns a Promise<Response> but because this package spans node/dom there is some weirdness with
  // compiling here
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  let options: RequestInit;

  if (method === 'GET' || method === 'HEAD') {
    options = {method};
  } else {
    let csrfToken = readCookie(readCookies(), 'csrf_token');
    if (!csrfToken) {
      // Cookies were possibly cleared, attempt to re-fetch the csrf token
      await fetch('/api/auth');
      csrfToken = readCookie(readCookies(), 'csrf_token');

      // Blow up if we still don't have a csrf token after a successful fetch
      if (!csrfToken) throw Error('Cannot make non GET/HEAD request without a csrf_token set');
    }
    options = {
      method,
      headers: {
        'content-type': 'application/json',
        'csrf-token': csrfToken,
      },
      body: JSON.stringify(body),
    };
  }

  const result = await fetch(endpoint, options);

  if (result && result.status === 200) return result;
  else throw new RequestError(result.status, method, endpoint, await result.text());
}

function apiClient<EndpointArg, RouteResult>(
  method: Method,
  endpointTemplate: string,
  endpoint: DataToEndpoint<EndpointArg>,
): (arg: EndpointArg) => Promise<Array<RouteResult>> {
  return async (arg: EndpointArg) => {
    const result = await jsonAction(method, endpoint(arg), arg, () => document.cookie);
    const json: Result<RouteResult> = await result.json();

    if ('status' in json)
      throw new RequestError(json.status, method, endpointTemplate, json.error || 'No error message returned');
    else return json.data;
  };
}

function createDynamicEndpoint(method: Method) {
  return function <RouteResult, EndpointArg = void>(
    endpointTemplate: string,
    endpoint: DataToEndpoint<EndpointArg> = () => endpointTemplate,
  ): RouteClient<RouteResult, EndpointArg> {
    return new RouteClient(method, endpointTemplate, apiClient(method, endpointTemplate, endpoint));
  };
}

export const get = createDynamicEndpoint('GET');

export const post = createDynamicEndpoint('POST');

export const put = createDynamicEndpoint('PUT');

export const deletes = createDynamicEndpoint('DELETE');
