## publishing

### authenticate with github

First, [create a GitHub personal access token](https://github.com/settings/tokens/new). Make sure to add these scopes:

- write:packages
- read:packages
- delete:packages

Then add this to `~/.npmrc`:

```
//npm.pkg.github.com/:_authToken=[your token here]
```
