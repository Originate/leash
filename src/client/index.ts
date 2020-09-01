import {Express, Request, Response} from 'express';

import {bad, Method, ControllerMethod} from '../types';
import {RequestError} from './request_error';

export {RequestError} from './request_error';

export class RouteClient<TRequest, TResponse> {
  constructor(
    private method: Method,
    public endpointTemplate: string,
    public client: (arg: TRequest) => Promise<TResponse>,
  ) {}

  install = (app: Express, controllerMethod: ControllerMethod<TResponse>): void => {
    switch (this.method) {
      case 'HEAD':
        app.head(this.endpointTemplate, this.wrap(controllerMethod));
        return;
      case 'GET':
        app.get(this.endpointTemplate, this.wrap(controllerMethod));
        return;
      case 'POST':
        app.post(this.endpointTemplate, this.wrap(controllerMethod));
        return;
      case 'PUT':
        app.put(this.endpointTemplate, this.wrap(controllerMethod));
        return;
      case 'DELETE':
        app.delete(this.endpointTemplate, this.wrap(controllerMethod));
        return;
    }
  };

  private wrap(controllerMethod: ControllerMethod<TResponse>) {
    return async (req: Request, res: Response) => {
      try {
        const result = await Promise.resolve(controllerMethod(req, res));

        if ('data' in result) {
          if (result.cookies) {
            for (const c of result.cookies) res.cookie(c.name, c.value, {maxAge: c.maxAge, httpOnly: c.httpOnly});
            delete result.cookies;
          }
          res.json(result).end();
        } else {
          res
            .status(result.status)
            .json(bad(result.status, result.error ?? `Bad result received with status: ${result.status}`))
            .end();
        }
      } catch (err) {
        console.debug('router layer error:', err);
        err instanceof RequestError
          ? res.status(err.status).json(bad(err.status, err.message)).end()
          : res
              .status(500)
              .json(bad(500, `Unexpected exception at router layer: ${err.message}`))
              .end();
      }
    };
  }
}
