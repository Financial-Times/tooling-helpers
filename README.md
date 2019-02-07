# 🛠️ Tooling Helpers

> Libraries for working with common tools and platforms

## Usage

## Install from GitHub

```bash
npm install github:Financial-Times/tooling-helpers
```

_Note:_ This package is not published on npm.

## Available Helpers

### [git](git/src/)

The git helper assists with common git operations such as cloning a repository,
adding a file, committing a file and pushing to a remote. This helper is a library
that exports a module, `git`.

**Usage example:**

```javascript
const { git } = require('@financial-times/tooling-helpers');

git.defaults({ workingDirectory: '/tmp/repository' });

await git.clone({ repository: 'git@github.com:org/repository.git' });
await git.createBranch({ name: 'new-feature-branch' });
```

See [`git/src/index.js`](git/src/index.js) for all available methods and
[`git/examples/`](git/examples/) for usage examples.

The git helper is a thin wrapper around [dugite](https://github.com/desktop/dugite),
which provides JavaScript bindings for interacting with the git command line
interface.

### [github](github/src/)

The github helper is a wrapper around the official GitHub REST API client for
JavaScript [@octokit/rest](https://github.com/octokit/rest.js). This helper
exposes a library and a CLI.

_Note:_ Requires a [GitHub personal access token](#github-personal-access-token-security)
for GitHub API requests that require authentication.

**Library usage example:**

```javascript
const github = require('@financial-times/tooling-helpers').github({
    personalAccessToken: process.env.GITHUB_PERSONAL_ACCESS_TOKEN
});
```

See [`github/examples/examples.js`](github/examples/examples.js) for a full set of
usage examples.

See [`github/src/index.js`](github/src/index.js) for all available methods.

**CLI usage:**

```
$ npx github:Financial-Times/tooling-helpers github --help
github <command>

Commands:
  github project:add-pull-request  Add a pull request to a project
  github project:create            Create a new project
  github pull-request:create       Create a new pull request

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
```

### [package-json](package-json/src/)

The package-json helper allows you to load, manipulate and write the contents of
a [`package.json`](https://docs.npmjs.com/files/package.json.html) file. This
helper exports a single class, `PackageJson`:

```javascript
const { PackageJson } = require('@financial-times/tooling-helpers');
```

See [`package-json/src/index.js`](package-json/src/index.js) for available methods.

## GitHub personal access token security

Some of the tooling helpers require a GitHub personal access token with all
`repo` scopes. This is _very powerful_ as it has access to modify a
repository's settings, so it is strongly recommended that you follow the guide
on [How to store and access a GitHub personal access token securely](https://github.com/Financial-Times/next/wiki/How-to-store-and-access-a-GitHub-personal-access-token-securely).
