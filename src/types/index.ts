import {Request, Response as ExpressResponse} from 'express';

import {Result} from './result';

export * from './result';

export type Method = 'HEAD' | 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface ControllerMethod<RouteResult> {
  (req: Request, res: ExpressResponse): Promise<Result<RouteResult>>;
}
