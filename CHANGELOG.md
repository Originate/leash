# 2.0.0

**This is a backwards-incompatible release.**

- `ControllerMethod` no longer allows you to return a non-`Promise`, as the sum type led to longer, confusing TypeScript error messages. TypeScript's UX around generics and disjunctions needs work, so we might revisit this decision as the compiler improves

- `document.cookie` support removed. We might bring this back in the future, but we wanted to enable end-users to write services that did not rely on cookie-based CSRF protection.

- We renamed the type arguments `RouteResult, EndpointArg` to `TResponse, TRequest` and reordered them to `TRequest, TResponse`. This should more accurately reflect what those types do, especially for POST and PUT requests. The previous order led to slightly unidiomatic code, where the type of the request came after the type of the response.

# 1.0.x

- Imported the bulk of the code from another project

