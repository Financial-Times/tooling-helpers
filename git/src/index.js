const { GitProcess } = require('dugite');
const gitExec = GitProcess.exec;

const constructCommandArgs = require('./helpers/construct-command-args');
const handleGitExecResult = require('./helpers/handle-git-exec-result');

/**
 * Clone a repository into a new directory.
 *
 * @see https://git-scm.com/docs/git-clone
 *
 * @param {object} options
 * @param {string} options.repository - @see https://git-scm.com/docs/git-clone#git-clone-ltrepositorygt
 * @param {string} options.directory - @see https://git-scm.com/docs/git-clone#git-clone-ltdirectorygt
 * @param {string} options.origin - @see https://git-scm.com/docs/git-clone#git-clone--oltnamegt
 * @param {string} options.branch - @see https://git-scm.com/docs/git-clone#git-clone--bltnamegt
 */
async function clone({ repository, directory, origin = null, branch = null }) {
    throw new Error('Method not yet implemented');
}

/**
 * Create a branch.
 *
 * @see https://git-scm.com/docs/git-branch
 *
 * @param {object} options
 * @param {string} options.name - @see https://git-scm.com/docs/git-branch#git-branch-ltbranchnamegt
 * @returns {Error}
 */
async function createBranch({ name }) {
    throw new Error('Method not yet implemented');
}

/**
 * Switch branches.
 *
 * @see https://git-scm.com/docs/git-checkout
 *
 * @param {object} options
 * @param {string} options.name
 * @returns {Error}
 */
async function checkoutBranch({ name }) {
    throw new Error('Method not yet implemented');
}

/**
 * Add file contents to the index.
 *
 * @see https://git-scm.com/docs/git-add
 *
 * @param {object} options
 * @param {string|array} options.files - Pass a string for a single file or an array for multiple files
 * @returns {Error}
 */
async function add({ files }) {
    throw new Error('Method not yet implemented');
}

/**
 * Remove files from the working tree and from the index.
 *
 * @see https://git-scm.com/docs/git-rm
 *
 * @param {object} options
 * @param {string|array} options.files - Pass a string for a single file or an array for multiple files
 * @returns {Error}
 */
async function rm({ files }) {
    throw new Error('Method not yet implemented');
}

/**
 * Record changes to the repository.
 *
 * @see https://git-scm.com/docs/git-commit
 *
 * @param {object} options
 * @param {string} options.message
 * @returns {Error}
 */
async function commit({ message }) {
    throw new Error('Method not yet implemented');
}

/**
 * Update remote refs along with associated objects.
 *
 * @see https://git-scm.com/docs/git-push
 *
 * @param {object} options
 * @param {string} options.refspec - @see https://git-scm.com/docs/git-push#git-push-ltrefspecgt82308203
 * @returns {Error}
 */
async function push({ refspec = null, repository = null } = {}) {
    throw new Error('Method not yet implemented');
}

/**
 * This module provides methods for executing common git operations.
 * It is a thin wrapper around dugite (https://github.com/desktop/dugite),
 * which provides JavaScript bindings for interacting with the git command line
 * interface.
 */
module.exports = {
    clone,
    createBranch,
    checkoutBranch,
    add,
    rm,
    commit,
    push,
};
