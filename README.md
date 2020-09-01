`@Originate/leash` is a small library that generates abstract endpoints, which can then be instantiated into two different ways:

1. As an API client for a browser frontend to consume, making `fetch()` calls to a backend
2. As Express routes for a Node.js backend to "install" into the Express app

This is similar to Haskell's excellent [servant](https://www.servant.dev/) library, except that, instead of generating the abstract endpoints at compiletime using Haskell's type system, we have to generate them as objects at runtime.

The library currently only supports GET, HEAD, POST, and PUT endpoints, where the POST and PUT endpoints must take JSON bodies. We might extend the library to handle more kinds of HTTP services in the future. Pull requests are welcome, as always.

## publishing

### authenticate with github

First, [create a GitHub personal access token](https://github.com/settings/tokens/new). Make sure to add these scopes:

- write:packages
- read:packages
- delete:packages

Then add this to `~/.npmrc`:

```
@Originate:registry = https://npm.pkg.github.com

_authToken=[your token here]
always-auth=true
```

### yarn

Get the dependencies.

### npm publish

Then type `npm publish`. That's it!
