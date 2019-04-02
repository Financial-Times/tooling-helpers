const fs = require("fs");
const path = require("path");

const createChangelog = require("./lib/changelog");
const { deepCloneObject, formatObjectAsJson } = require("./lib/helpers");

const dependencyFields = [
    "dependencies",
    "devDependencies",
    "optionalDependencies",
    "peerDependencies"
];

/**
 * TODO: Give this a better description
 * 
 * @param {object} options
 * @param {string} options.filepath - Filepath to a `package.json` file
 */
module.exports = function loadPackageJson(options = {}) {
    if (!options.filepath) {
        throw new Error(
            "package-json#constructor: `filepath` option must be specified"
        );
    }

    options.filepath = path.resolve(options.filepath);

    const changelog = createChangelog();

    let originalContents;
    try {
        originalContents = JSON.parse(fs.readFileSync(options.filepath, { encoding: 'utf-8' }));
    } catch (err) {
        throw new Error(`package-json#loadPackageJson: Unable to parse file as JSON: ${options.filepath}`);
    }

    let previousContents = deepCloneObject(originalContents);
    const workingContents = deepCloneObject(originalContents);

    /**
     * TODO: Describe this method
     * 
     * @returns {object}
     */
    function getDocument() {
        return deepCloneObject(workingContents);
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
     * Write to the `package.json` file.
     *
     * @returns boolean
     */
    function writeChanges() {
        try {
            fs.writeFileSync(options.filepath, formatObjectAsJson(workingContents) + "\n");
        } catch (err) {
            throw new Error(`package-json#writeChanges: Error writing changes to file '${options.filepath}'\n\n${err.message}`);
        }

        previousContents = deepCloneObject(workingContents);

        return true;
    }

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
        const changes = { event: "setField", field };

        const fieldAlreadyExists =
            typeof workingContents[field] !== "undefined";

        if (fieldAlreadyExists) {
            changes.previousValue = workingContents[field];
        }

        workingContents[field] = value;

        return changelog.createEntry(changes);
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
        if (!dependencyFields.includes(field)) {
            throw new Error(
                `package-json#requireDependency: Invalid field specified '${field}'. Valid fields: ${dependencyFields.join(
                ", "
                )}`
            );
        }

        // TODO: Review and test this
        if (!workingContents[field]) {
            workingContents[field] = {};
        }

        const dependencies = workingContents[field];

        const changes = { event: "requireDependency", field, pkg, version };

        const dependencyAlreadyExists = (typeof dependencies[pkg] !== "undefined");
        changes.alreadyExisted = dependencyAlreadyExists;
        if (dependencyAlreadyExists) {
            changes.previousValue = dependencies[pkg];
        }

        dependencies[pkg] = version;

        return changelog.createEntry(changes);
    }

    /**
     * Remove a package as a dependency from `package.json`.
     *
     * @param {object} options
     * @param {string} options.pkg
     * @param {string} options.field
     *
     * @returns {object|boolean} - changelog entry or `false` if dependency doesn't exist
     */
    function removeDependency({ pkg, field }) {
        if (!dependencyFields.includes(field)) {
            throw new Error(
                `package-json#removeDependency: Invalid field specified '${field}'. Valid fields: ${dependencyFields.join(
                ", "
                )}`
            );
        }

        // TODO: Review and test this
        if (!workingContents[field]) {
            return false;
        }

        const dependencies = workingContents[field];

        const changes = { event: "removeDependency", pkg, field };

        if (typeof dependencies[pkg] !== "undefined") {
            changes.previousValue = dependencies[pkg];
            delete dependencies[pkg];
        } else {
            return false;
        }

        return changelog.createEntry(changes);
    }

    /**
     * Require a script to exist in the `scripts` field of `package.json`.
     *
     * @see https://docs.npmjs.com/misc/scripts
     *
     * @param {object} options
     * @param {string} options.lifecycleEvent - e.g. start, test, build, deploy
     * @param {string} options.command
     *
     * @returns {object} - changelog entry
     */
    function requireScript({ lifecycleEvent, command }) {
        const changes = { event: "requireScript", field: "scripts", lifecycleEvent };

        const scriptsFieldExists =
            typeof workingContents.scripts !== "undefined";

        if (!scriptsFieldExists) {
            workingContents.scripts = {};
        }

        const scripts = workingContents.scripts;

        const lifecycleEventAlreadyExists =
            typeof scripts[lifecycleEvent] !== "undefined";

        changes.alreadyExisted = lifecycleEventAlreadyExists;

        scripts[lifecycleEvent] = command;

        return changelog.createEntry(changes);
    }

    return {
        getDocument,
        hasChangesToWrite,
        writeChanges,
        getField,
        setField,
        requireDependency,
        removeDependency,
        requireScript
    };
};
