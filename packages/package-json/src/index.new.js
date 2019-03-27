const fs = require("fs");

/**
 * Deep clone a JavaScript object.
 *
 * @param {object} object
 */
function deepCloneObject(object) {
    return JSON.parse(JSON.stringify(object));
}

/**
 * Convert a JavaScript object to a formatted JSON string.
 *
 * @param {object} object
 * @returns {string}
 */
function formatObjectAsJson(object) {
    const formattedContents =
        JSON.stringify(object, null, 2) + "\n";

    return formattedContents;
}

/**
 * TODO: Give this a better description
 * TODO: Validate filepath existence
 * TODO: Validate file is actually a package.json
 * 
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

    /**
     * Set the value for a specific field in the `package.json` object.
     *
     * @param {string} field
     * @param {*} value
     *
     * @returns {object} - changelog entry
     */
    function setField(field, value) {
        const changelogEntry = {
            event: "setField",
            field,
            previousValue: false,
            written: false
        };

        const fieldAlreadyExists =
            typeof workingContents[field] !== "undefined";

        if (fieldAlreadyExists) {
            changelogEntry.previousValue = workingContents[field];
        }

        workingContents[field] = value;

        if (options.writeImmediately === true) {
            write();
            changelogEntry.written = true;
        }

        changelog.push(changelogEntry);

        return changelogEntry;
    };

    /**
     * Write to the `package.json` file.
     *
     * @returns boolean
     */
    function write() {
        fs.writeFileSync(options.filepath, formatObjectAsJson(workingContents));

        for (let entry of changelog) {
        entry.written = true;
        }

        previousContents = deepCloneObject(workingContents);

        return true;
    }



    return {
        getField,
        setField
    };
};
