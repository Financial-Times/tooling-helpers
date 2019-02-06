const assert = require('assert');
const { GitProcess } = require('dugite');
const dugiteExec = GitProcess.exec;

const constructDugiteExecArgs = require('./helpers/construct-dugite-exec-args');
const defaults = require('./helpers/defaults');
const handleDugiteExecResult = require('./helpers/handle-dugite-exec-result');

/**
 * Clone a repository into a new directory.
 *
 * @see https://git-scm.com/docs/git-clone
 *
 * @param {object} options
 * @param {string} options.repository - @see https://git-scm.com/docs/git-clone#git-clone-ltrepositorygt
 * @param {string} options.directory - Default: `defaults.workingDirectory`. @see https://git-scm.com/docs/git-clone#git-clone-ltdirectorygt
 * @param {string} options.origin - @see https://git-scm.com/docs/git-clone#git-clone--oltnamegt
 * @param {string} options.branch - @see https://git-scm.com/docs/git-clone#git-clone--bltnamegt
 * @returns {boolean}
 */
async function clone({ repository, directory = defaults.workingDirectory, origin = '', branch = '' } = {}) {
    try {
        assert(repository && typeof repository === 'string', 'repository is invalid');
        assert(directory && typeof directory === 'string', 'directory is invalid');
        assert(typeof origin === 'string', 'origin must be a string');
        assert(typeof branch === 'string', 'branch must be a string');
    } catch (err) {
        throw new Error(`InvalidOptions: ${err.message}`);
    }

    const dugiteExecArgs = constructDugiteExecArgs({
        command: 'clone',
        options: {
            '--origin': origin,
            '--branch': branch
        },
        positional: [repository, directory]
    });

    /**
     * Current working directory isn't relevant in the context of `git clone`
     * as a current working directory doesn't yet exist, but we have to pass
     * an existing directory path as `GitProcess.exec` always requires one.
     */
    const dugiteExecResult = await dugiteExec(dugiteExecArgs, process.cwd());

    return handleDugiteExecResult({ dugiteExecResult, dugiteExecArgs });
}

/**
 * Create a branch.
 *
 * @see https://git-scm.com/docs/git-branch
 *
 * @param {object} options
 * @param {string} options.name - @see https://git-scm.com/docs/git-branch#git-branch-ltbranchnamegt
 * @param {string} options.workingDirectory - Directory path to execute git command in (overrides defaults)
 * @returns {boolean}
 */
async function createBranch({ name, workingDirectory = defaults.workingDirectory } = {}) {
    try {
        assert(name && typeof name === 'string', 'name is invalid');
        assert(workingDirectory && typeof workingDirectory === 'string', 'workingDirectory must be a string');
    } catch (err) {
        throw new Error(`InvalidOptions: ${err.message}`);
    }

    const dugiteExecArgs = constructDugiteExecArgs({
        command: 'branch',
        positional: [name]
    });

    const dugiteExecResult = await dugiteExec(dugiteExecArgs, workingDirectory);

    return handleDugiteExecResult({ dugiteExecResult, dugiteExecArgs, workingDirectory });
}

/**
 * This module provides methods for executing common git operations.
 * It is a thin wrapper around dugite (https://github.com/desktop/dugite),
 * which provides JavaScript bindings for interacting with the git command line
 * interface.
 */
module.exports = {
    defaults,
    clone,
    createBranch,
};
