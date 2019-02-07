/**
 * Inspects an `IGitResult` object, as returned by dugite's `GitProcess.exec`
 * method, throwing an error if the git command did not execute successfully.
 *
 * @see https://github.com/desktop/dugite/blob/b8269221202b4ec543eac35f4c8a2ad2c8957083/docs/api/exec.md
 *
 * @param {object} options
 * @param {import('dugite').IGitResult} options.dugiteExecResult
 * @param {array} options.dugiteExecArgs - @see construct-dugite-exec-args.js
 * @param {string} options.workingDirectory - Directory path git command was executed in
 * @throws {Error}
 * @returns {boolean}
 */
module.exports = function handleDugiteExecResult({
    dugiteExecResult,
    dugiteExecArgs,
    workingDirectory = null
}) {
    if (dugiteExecResult.exitCode === 0) {
        return true;
    }

    const commandRun = ['git'];
    if (workingDirectory) {
        commandRun.push(`-C ${workingDirectory}`);
    }
    commandRun.push(...dugiteExecArgs);

    throw new Error(`GitCommandError: Error running git command:\n\n${
        commandRun.join(' ')
    }\n\nError message from git:\n\n${
        /**
         * Sometimes the `git` CLI sends error messages to stdout
         * e.g. when you run `git commit` and there is nothing to commit.
         * If stderr is empty we can see if stdout has something useful.
         */
        dugiteExecResult.stderr || dugiteExecResult.stdout
    }`);
};
