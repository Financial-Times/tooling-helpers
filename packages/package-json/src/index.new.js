/**
 * Deep clone a JavaScript object.
 *
 * @param {object} object
 */
function deepCloneObject(object) {
    return JSON.parse(JSON.stringify(object));
}

/**
 * TODO: Give this a better description
 *
 * @param {object} options
 * @param {string} options.filepath - Filepath to a `package.json` file
 * @param {boolean} options.writeImmediately - When a change is made automatically write it to the `package.json` file (default: false)
 */
module.exports = function loadPackageJson(overrideOptions = {}) {
    if (!overrideOptions.filepath) {
        throw new Error(
        "PackageJson#constructor: `filepath` option must be specified"
        );
    }

    const defaults = {
        writeImmediately: false
    };

    const options = { ...defaults, ...overrideOptions };

    const changelog = [];

    const originalContents = require(options.filepath);
    // const previousContents = deepCloneObject(originalContents);
    const workingContents = deepCloneObject(originalContents);

    /**
     * Get a specific field from the `package.json` object.
     *
     * @param {string} field
     * @returns {*}
     */
    function getField(field) {
      return workingContents[field];
    }

    return {
        getField
    };
};
