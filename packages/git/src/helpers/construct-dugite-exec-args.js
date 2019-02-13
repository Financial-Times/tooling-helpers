/**
 * Creates an array of arguments suitable for passing to dugite's
 * `GitProcess.exec` method. Options and positional arguments with falsey
 * values will be ignored.
 *
 * @see https://github.com/desktop/dugite/blob/b8269221202b4ec543eac35f4c8a2ad2c8957083/docs/api/exec.md
 *
 * @example
 * ```javascript
 * constructDugiteExecArgs({
 *     command: "clone",
 *     options: { "--origin": "origin", "--branch": "master" },
 *     positional: [ "git@github.com:org/repository.git", "/tmp/repo" ]
 * })
 * ```
 *
 * @param {object} options
 * @param {string} options.command - git command e.g. `clone`
 * @param {object} options.options - Mapping of options to values for git command e.g. { '--branch': 'branch-name', '--short': true }. Options with falsey values will be ignored.
 * @param {array} options.positional - Array of positional arguments for git command. Elements with falsey values will be ignored.
 * @returns {array}
 */
module.exports = function constructDugiteExecArgs({
    command,
    options = {},
    positional = []
}) {
    const filteredOptions = [];
    const optionsKeys = Object.keys(options);
    for (let optionKey of optionsKeys) {
        const optionValue = options[optionKey];
        const optionIsFlag = (optionValue === true);
        const optionIsNotEmpty = Boolean(optionValue);
        if (optionIsFlag) {
            filteredOptions.push(optionKey);
        } else if (optionIsNotEmpty) {
            filteredOptions.push(optionKey, optionValue);
        }
    }

    const filteredPositionalArgs = positional.filter(arg => arg);

    return [
        command,
        ...filteredOptions,
        ...filteredPositionalArgs
    ];
};
