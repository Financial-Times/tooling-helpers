const fs = require("fs");

const compatibleFields = [
    "dependencies",
    "devDependencies",
    "optionalDependencies",
    "peerDependencies",
    "scripts"
];

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
    const previousContents = deepCloneObject(originalContents);
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
     * Removes a specific field (and associated values) in the `package.json` object.
     *
     * @param {string} field
     * @param {*} value
     *
     * @returns {object} - changelog entry
     */

    function removeField(field) {
        const changelogEntry = {
            event: "removeField",
            field,
            previousValue: false,
            // TODO: could we change the written field to changeWritten? I keep reading it as whether the logEntry has been written
            written: false
        };

        const fieldAlreadyExists =
            typeof workingContents[field] !== "undefined";

        if (fieldAlreadyExists) {
            changelogEntry.previousValue = workingContents[field];
        } else {
            console.log("field does not exist")
            // TODO: anything else here??
        }

        delete workingContents.field;

        if (options.writeImmediately === true) {
            write();
            // TODO: do we want to change/add a different changeLogEntry field for this?
            changelogEntry.written = true;
        }

        changelog.push(changelogEntry);

        return changelogEntry;
    }


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

    /**
     * Check if there are file changes to write.
     *
     * @returns boolean
     */
    function hasChangesToWrite() {
        const formattedPreviousContents = formatObjectAsJson(previousContents);
        const formattedWorkingContents = formatObjectAsJson(workingContents);

        return (formattedPreviousContents !== formattedWorkingContents);
    }

    /**
     * Require a package to exist as a dependency in `package.json`.
     *
     * @param {object} options
     * @param {string} options.pkg - Package name
     * @param {string} options.version
     * @param {string} options.field
     *
     * @returns {object} - changelog entry
     */
    function requireDependency({ pkg, version, field }) {
        if (!compatibleFields.includes(field)) {
            throw new Error(
                `PackageJson#addDependency: Invalid field specified '${field}'. Valid fields: ${compatibleFields.join(
                ", "
                )}`
            );
        }

        const dependencies = workingContents[field];

        const changelogEntry = {
            event: "requireDependency",
            pkg,
            field,
            version,
            previousVersionRange: false,
            written: false
        };

        const dependencyAlreadyExists = typeof dependencies[pkg] !== "undefined";
        if (dependencyAlreadyExists) {
            changelogEntry.previousVersionRange = dependencies[pkg];
        }

        dependencies[pkg] = version;

        if (options.writeImmediately === true) {
            write();
            changelogEntry.written = true;
        }

        changelog.push(changelogEntry);

        return changelogEntry;
    }

    /**
     * Remove a package as a dependency from `package.json`.
     *
     * @param {object} options
     * @param {string} options.pkg
     * @param {string} options.field
     *
     * @returns {object} - changelog entry
     */
    function removeDependency({ pkg, field }) {
        if (!compatibleFields.includes(field)) {
            throw new Error(
                `PackageJson#removeDependency: Invalid field specified '${field}'. Valid fields: ${compatibleFields.join(
                ", "
                )}`
            );
        }

        const dependencies = workingContents[field];

        const changelogEntry = {
            event: "removeDependency",
            pkg,
            field,
            version: null,
            written: false
        };

        if (typeof dependencies[pkg] !== "undefined") {
            changelogEntry.version = dependencies[pkg];
            delete dependencies[pkg];
        } else {
            // TODO: What should we do if the dependency doesn't exist?
            console.log('pkg does not exist!')
        }

        if (options.writeImmediately === true) {
            write();
            changelogEntry.written = true;
        }

        changelog.push(changelogEntry);

        return changelogEntry;
    }

    /**
     * Require a script to exist in the `scripts` field of `package.json`.
     *
     * @param {object} options
     * @param {string} options.lifecycleEvent
     * @param {string} options.command
     *
     * @returns {object} - changelog entry
     */
    function requireScript({ lifecycleEvent, command }) {
        // TODO: could rename lifecycleEvent to npmStage or something?
        const changelogEntry = {
            event: "requireScript",
            lifecycleEvent,
            alreadyExisted: false,
            written: false
        };

        const scriptsFieldExists =
            typeof workingContents.scripts !== "undefined";

        if (!scriptsFieldExists) {
            workingContents.scripts = {};
        }

        const scripts = workingContents.scripts;

        const lifecycleEventAlreadyExists =
            typeof scripts[lifecycleEvent] !== "undefined";

        changelogEntry.alreadyExisted = lifecycleEventAlreadyExists;

        scripts[lifecycleEvent] = command;

        if (options.writeImmediately === true) {
            write();
            changelogEntry.written = true;
        }

        changelog.push(changelogEntry);

        return changelogEntry;
    }

    return {
        getField,
        setField,
        removeField,
        hasChangesToWrite,
        requireDependency,
        removeDependency,
        requireScript
    };
};
