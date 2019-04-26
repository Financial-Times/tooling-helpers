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
 * Load a `package.json` file in to memory so that it can be manipulated.
 *
 * After reading the specified `package.json` file, the `loadPackageJson`
 * method returns a collection of methods that can be used for changing
 * the `package.json` object and writing those changes back to disk.
 *
 * _Note on `package` vs `pkg`:_
 *
 * [ECMAScript 2](https://www.ecma-international.org/publications/files/ECMA-ST-ARCH/ECMA-262,%202nd%20edition,%20August%201998.pdf)
 * added `package` as a reserved word for future use so it is not allowed as a
 * variable or property name in JavaScript. This is why you will see methods in
 * this module that require `pkg` as an option, rather than `package`.
 *
 * @namespace {function} loadPackageJson
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

	let originalContents;
	try {
		originalContents = JSON.parse(
			fs.readFileSync(options.filepath, { encoding: "utf-8" })
		);
	} catch (err) {
		throw new Error(
			`package-json#loadPackageJson: Unable to read and parse file: ${
				options.filepath
			}\n\n${err.message}`
		);
	}

	let previousContents = deepCloneObject(originalContents);
	const workingContents = deepCloneObject(originalContents);

	const changelog = createChangelog();

	return {
		/**
		 * @memberof loadPackageJson
		 * @function getChangelog
		 */
		getChangelog: changelog.get,
		get,
		hasChangesToWrite,
		writeChanges,
		getField,
		setField,
		removeField,
		requireDependency,
		removeDependency,
		requireScript,
		removeScript
	};

	/**
	 * Get an object representing the current working state of the
	 * `package.json` object. This may be different to what exists
	 * on the file system if changes have not yet been written by
	 * calling the `writeChanges` method.
	 *
	 * @memberof loadPackageJson
	 * @returns {object}
	 */
	function get() {
		return deepCloneObject(workingContents);
	}

	/**
	 * Check if there are file changes to write.
	 *
	 * @memberof loadPackageJson
	 * @returns {boolean}
	 */
	function hasChangesToWrite() {
		const formattedPreviousContents = formatObjectAsJson(previousContents);
		const formattedWorkingContents = formatObjectAsJson(workingContents);

		return formattedPreviousContents !== formattedWorkingContents;
	}

	/**
	 * Write to the `package.json` file.
	 *
	 * @memberof loadPackageJson
	 * @returns {boolean}
	 */
	function writeChanges() {
		try {
			fs.writeFileSync(
				options.filepath,
				formatObjectAsJson(workingContents) + "\n"
			);
		} catch (err) {
			throw new Error(
				`package-json#writeChanges: Error writing changes to file '${
					options.filepath
				}'\n\n${err.message}`
			);
		}

		previousContents = deepCloneObject(workingContents);

		return true;
	}

	/**
	 * Get a specific field from the `package.json` object.
	 *
	 * @memberof loadPackageJson
	 * @param {string} field
	 * @returns {*}
	 */
	function getField(field) {
		return workingContents[field];
	}

	/**
	 * Set the value for a specific field in the `package.json` object.
	 *
	 * @memberof loadPackageJson
	 * @param {string} field
	 * @param {*} value
	 * @returns {object} - changelog entry
	 */
	function setField(field, value) {
		const changes = { event: "setField", field };

		const fieldAlreadyExists = typeof workingContents[field] !== "undefined";
		changes.alreadyExisted = fieldAlreadyExists;
		if (fieldAlreadyExists) {
			changes.previousValue = workingContents[field];
		}

		workingContents[field] = value;

		return changelog.createEntry(changes);
	}

	/**
	 * Removes a specific field from the `package.json` object.
	 *
	 * @param {string} field
	 * @returns {object} - changelog entry
	 */
	function removeField(field) {
		const changes = {
			event: "removeField",
			field
		};

		const fieldExists = typeof workingContents[field] !== "undefined";

		if (fieldExists) {
			changes.previousValue = workingContents[field];
			changes.alreadyExisted = true;
		} else {
			return false;
		}

		delete workingContents[field];

		return changelog.createEntry(changes);
	}

	/**
	 * Require a package to exist as a dependency in `package.json`.
	 *
	 * @memberof loadPackageJson
	 * @param {object} options
	 * @param {string} options.pkg - Package name. Note: This option is named `pkg` as `package` is a reserved word in JavaScript.
	 * @param {string} options.version
	 * @param {string} options.field
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

		if (!workingContents[field]) {
			workingContents[field] = {};
		}

		const dependencies = workingContents[field];

		const changes = { event: "requireDependency", field, pkg, version };

		const dependencyAlreadyExists = typeof dependencies[pkg] !== "undefined";
		if (dependencyAlreadyExists) {
			changes.previousValue = dependencies[pkg];
			changes.alreadyExisted = true;
		}

		dependencies[pkg] = version;

		return changelog.createEntry(changes);
	}

	/**
	 * Remove a package as a dependency from `package.json`.
	 *
	 * @memberof loadPackageJson
	 * @param {object} options
	 * @param {string} options.pkg - Package name. Note: This option is named `pkg` as `package` is a reserved word in JavaScript.
	 * @param {string} options.field
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

		if (!workingContents[field]) {
			return false;
		}

		const dependencies = workingContents[field];

		const changes = {
			event: "removeDependency",
			field,
			alreadyExisted: true,
			pkg
		};

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
	 * @memberof loadPackageJson
	 * @param {object} options
	 * @param {string} options.stage - e.g. start, test, build, deploy
	 * @param {string} options.command
	 * @returns {object} - changelog entry
	 */
	function requireScript({ stage, command }) {
		const changes = {
			event: "requireScript",
			field: "scripts",
			stage
		};

		const scriptsFieldExists = typeof workingContents.scripts !== "undefined";

		if (!scriptsFieldExists) {
			workingContents.scripts = {};
		}

		const scripts = workingContents.scripts;

		const stageAlreadyExists = typeof scripts[stage] !== "undefined";

		changes.alreadyExisted = stageAlreadyExists;

		scripts[stage] = command;

		return changelog.createEntry(changes);
	}

	/**
	 * Remove a script from the `scripts` field of `package.json`.
	 *
	 * @see https://docs.npmjs.com/misc/scripts
	 *
	 * @param {object} options
	 * @param {string} options.stage - e.g. start, test, build, deploy
	 * @returns {object} - changelog entry
	 */
	function removeScript(stage) {
		const changes = {
			event: "removeScript",
			field: "scripts",
			stage
		};

		const scripts = workingContents.scripts;
		const scriptsFieldExists = typeof scripts !== "undefined";
		const stageExists =
			scriptsFieldExists && typeof scripts[stage] !== "undefined";

		if (!stageExists) {
			return false;
		}

		delete scripts[stage];
		changes.alreadyExisted = true;

		return changelog.createEntry(changes);
	}
};
