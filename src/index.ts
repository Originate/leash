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

export async function fetchAsJSON(method: Method, endpoint: string, body: unknown): Promise<Response> {
  let options: RequestInit;

  if (method === 'GET' || method === 'HEAD') {
    options = {method};
  } else {
    options = {
      method,
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(body),
    };
  }

  const result = await fetch(endpoint, options);
  if (result && result.status === 200) return result;
  else throw new RequestError(result.status, method, endpoint, await result.text());
}

function apiClient<TRequest, TResponse>(
  method: Method,
  endpointTemplate: string,
  endpoint: DataToEndpoint<TRequest>,
): (arg: TRequest) => Promise<TResponse> {
  return async (arg: TRequest) => {
    const result = await fetchAsJSON(method, endpoint(arg), arg);
    const json: Result<TResponse> = await result.json();
    if ('status' in json)
      throw new RequestError(json.status, method, endpointTemplate, json.error || 'No error message returned');
    else return json.data;
  };
}

function createDynamicEndpoint(method: Method) {
  return function <TRequest, TResponse>(
    endpointTemplate: string,
    endpoint: DataToEndpoint<TRequest> = () => endpointTemplate,
  ): RouteClient<TRequest, TResponse> {
    return new RouteClient(method, endpointTemplate, apiClient(method, endpointTemplate, endpoint));
  };
}

export const get = createDynamicEndpoint('GET');

export const post = createDynamicEndpoint('POST');

export const put = createDynamicEndpoint('PUT');

export const deletes = createDynamicEndpoint('DELETE');
