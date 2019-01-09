# 🛠️ Tooling Helpers

> Libraries for working with common tools and platforms

## Available helpers

- [git](git/src/index.js)
- [PackageJson](package-json/src/index.js)

## Usage

## Install from GitHub

```bash
npm install Financial-Times/tooling-helpers
```

## `git` helper

The `git` helper exports two classes:

```javsacript
const { Git, GitRepo } = require('@financial-times/tooling-helpers').git;
```

See [git/src/index.js](git/src/index.js) for available methods.

## `PackageJson` helper

The `PackageJson` helper exports a single class:

```javsacript
const { PackageJson } = require('@financial-times/tooling-helpers');
```

See [package-json/src/index.js](package-json/src/index.js) for available methods.

## `GitHub` helper

See [github/src/commands](github/src/commands) for available methods.
