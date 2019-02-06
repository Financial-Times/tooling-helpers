const git = require('../src');

/**
 * `createBranch` will run the git command in the current working directory for the node process.
 *
 * @see git.defaults.workingDirectory
 */
git.createBranch({
    name: 'new-feature-branch'
});

/**
 * Set default options.
 */
git.defaults({
    workingDirectory: '/tmp/repository'
});

/**
 * `createBranch` will run the git command in `/tmp/repository`
 */
git.createBranch({
    name: 'new-feature-branch'
});

/**
 * `createBranch` will run the git command in `/tmp/some-other-repository`
 */
git.createBranch({
    name: 'another-new-feature-branch',
    workingDirectory: '/tmp/some-other-repository'
});

/**
 * `checkoutBranch` will run the git command in `/tmp/repository`
 */
git.checkoutBranch({
    name: 'new-feature-branch'
});

/**
 * `checkoutBranch` will run the git command in `/tmp/some-other-repository`
 */
git.checkoutBranch({
    name: 'another-new-feature-branch',
    workingDirectory: '/tmp/some-other-repository'
});
