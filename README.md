# 🛠️ Tooling Helpers

> Libraries for working with common tools and platforms

## Available helpers

- [git](git/src/index.js)
- [package-json](package-json/src/index.js)

## Usage

## Install from GitHub

```bash
npm install Financial-Times/tooling-helpers
```

## `git` helper

The `git` helper exports a single class:

```javascript
const { Git } = require('@financial-times/tooling-helpers');
```

See [git/src/index.js](git/src/index.js) for available methods.

_Note:_ Requires a [GitHub personal access token](#github-personal-access-token-security) with `repo` scope to be able to
clone and push to private remote repositories.

## `package-json` helper

The `package-json` helper exports a single class:

```javascript
const { PackageJson } = require('@financial-times/tooling-helpers');
```

See [package-json/src/index.js](package-json/src/index.js) for available methods.

## GitHub personal access token security

Some of the tooling helpers require a GitHub personal access token with all
`repo` scopes. This is _very powerful_ as it has access to modify a
repository's settings, so it is strongly recommended that you follow the guide
on [How to store and access a GitHub personal access token securely](https://github.com/Financial-Times/next/wiki/How-to-store-and-access-a-GitHub-personal-access-token-securely).
