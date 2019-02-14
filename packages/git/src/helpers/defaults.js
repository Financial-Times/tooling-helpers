/**
 * Sets default options for use by any module methods.
 *
 * Where a method uses a default option, that option can be overridden via
 * the methods' options. See `examples/defaults.js` script for usage examples.
 *
 * @param {object} options
 * @param {string} options.workingDirectory - Directory path to execute git commands in
 * @returns {void}
 */
function defaults({ workingDirectory = null }) {
    if (workingDirectory !== null) {
        defaults.workingDirectory = workingDirectory;
    }
}

/**
 * Directory path to execute git commands in.
 * Defaults to current working directory for node process, `process.cwd()`.
 *
 * @type string
 */
defaults.workingDirectory = process.cwd();

module.exports = defaults;
