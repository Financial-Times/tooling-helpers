# git

This library assists with common git operations such as cloning a repository,
adding a file, committing a file and pushing to a remote.

This library is a thin wrapper around [dugite](https://github.com/desktop/dugite),
which provides JavaScript bindings for interacting with the git command line
interface.

## Usage

```
npm install @financial-times/git
```

```javascript
const git = require('@financial-times/git');

git.defaults({ workingDirectory: '/tmp/repository' });

await git.clone({ repository: 'git@github.com:org/repository.git' });
await git.createBranch({ name: 'new-feature-branch' });
```

See [`src/index.js`](src/index.js) for all available methods and
[`examples/`](examples/) for usage examples.
