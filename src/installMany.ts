import {ControllerMethod} from './types';
import {RouteClient} from './client';
import {Express} from 'express';

/**
 * installMany allows you to write the following type of code:
 *
 *     installMany(router, routes)
 *
 * where router might be
 *
 * {
 *     "signup": Router.post<SignupRequest, SignupResponse>('/api/auth/signup'),
 *     "login": Router.post<LoginRequest, LoginResponse>('/api/auth/login'),
 * }
 *
 * and routes might be
 *
 * {
 *     "signup": ... as (req: Request, res: ExpressResponse) => Promise<Result<SignupResponse>>,
 *     "login": ... as (req: Request, res: ExpressResponse) => Promise<Result<LoginResponse>>,
 * }
 *
 * Note that, even though the objects share the same "spine" (their keys are
 * identical), their values have extremely different types. The bulk of this
 * method is the type signature, which carefully assumes nothing about the
 * objects and then pattern matches into the values using `infer`, `keyof`, and
 * `extends` from the recent TypeScript "conditional types" keywords package.
 *
 * Note also that the obvious thing of having `TRoutes extends Record<string,
 * unknown>` does not work because that makes us unable to write
 * `routes[key].install(...)` at the end of the function.
 *
 * Note additionally that we have to infer both `TRequest` and `TResponse` in
 * the type of `routes` because simply saying `[K in keyof TRoutes]:
 * RouteClient<infer T, infer U>` fixes the _same_ T and U for all values of
 * that object.
 */
export function installMany<TRoutes>(
  app: Express,
  routes: TRoutes &
    {
      [K in keyof TRoutes]: TRoutes[K] extends RouteClient<infer TRequest, infer TResponse>
        ? RouteClient<TRequest, TResponse>
        : never;
    },
  methods: {
    [K in keyof TRoutes]: TRoutes[K] extends RouteClient<never, infer TResponse> ? ControllerMethod<TResponse> : never;
  },
) {
  for (const key in routes) {
    routes[key].install(app, methods[key]);
  }
}
