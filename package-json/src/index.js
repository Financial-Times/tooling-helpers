const fs = require("fs");

const dependencyFields = [
  "dependencies",
  "devDependencies",
  "optionalDependencies",
  "peerDependencies"
];

const changelogMessages = {
  setField: ({ field, previousValue }) => {
    let message = `Set value for field '${field}'`;
    message += previousValue
      ? ` (overwrote existing value)`
      : " (new field)";
    return message;
  },
  requireDependency: ({ pkg, field, version, previousVersionRange }) => {
    let message = `Required package ${pkg}@${version} in ${field}`;
    message += previousVersionRange
      ? `, previously ${previousVersionRange}`
      : " (new dependency)";
    return message;
  },
  removeDependency: ({ pkg, field }) => {
    let message = `Removed package ${pkg} from ${field}`;
    return message;
  },
  requireScript: ({ lifecycleEvent, alreadyExisted }) => {
    let message = `Required script for lifecycle event '${lifecycleEvent}'`;
    message += alreadyExisted
      ? ` (overwrote existing command)`
      : " (new script)";
    return message;
  }
};

/**
 * Class for reading and manipulating the contents of a `package.json`
 */
class PackageJson {
  /**
   * Create an instance of the `PackageJson` class.
   * Reads the `package.json` file into memory.
   *
   * @param {object} options
   * @param {string} options.filepath - Filepath to a `package.json` file
   * @param {boolean} options.writeImmediately - When a change is made automatically write it to the `package.json` file (default: false)
   */
  constructor(options) {
    if (!options.filepath) {
      throw new Error(
        "PackageJson#constructor: `filepath` option must be specified"
      );
    }

    const defaults = {
      writeImmediately: false
    };

    this.options = { ...defaults, ...options };

    this.changelog = [];

    this.originalContents = require(this.options.filepath);
    this.workingContents = { ...this.originalContents };
  }

  /**
   * Get a specific field from the `package.json` object.
   *
   * @param {string} field
   * @returns {*}
   */
  getField(field) {
    return this.workingContents[field];
  }

  /**
   * Set the value for a specific field in the `package.json` object.
   *
   * @param {string} field
   * @param {*} value
   *
   * @returns {object} - changelog entry
   */
  setField(field, value) {
    const changelogEntry = {
      event: "setField",
      field,
      previousValue: false,
      written: false
    };

    const fieldAlreadyExists =
      typeof this.workingContents[field] !== "undefined";

    if (fieldAlreadyExists) {
      changelogEntry.previousValue = this.workingContents[field];
    }

    this.workingContents[field] = value;

    if (this.options.writeImmediately === true) {
      this.write();
      changelogEntry.written = true;
    }

    this.changelog.push(changelogEntry);

    return changelogEntry;
  }

  /**
   * Write to the `package.json` file.
   *
   * @returns boolean
   */
  write() {
    const formattedContents =
      JSON.stringify(this.workingContents, null, 2) + "\n";

    fs.writeFileSync(this.options.filepath, formattedContents);

    for (let entry of this.changelog) {
      entry.written = true;
    }

    return true;
  }

  /**
   * Returns information about where/if a package exists in the dependencies
   * specified by the `package.json` file.
   *
   * @param {object} options
   * @param {string} options.pkg
   */
  findDependency({ pkg }) {
    // TODO: Implement
    // @returns [{ version: '^1.13.2', field: 'devDependencies' }]
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
  requireDependency({ pkg, version, field }) {
    if (!dependencyFields.includes(field)) {
      throw new Error(
        `PackageJson#addDependency: Invalid field specified '${field}'. Valid fields: ${dependencyFields.join(
          ", "
        )}`
      );
    }

    const dependencies = this.workingContents[field];

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

    if (this.options.writeImmediately === true) {
      this.write();
      changelogEntry.written = true;
    }

    this.changelog.push(changelogEntry);

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
  removeDependency({ pkg, field }) {
    if (!dependencyFields.includes(field)) {
      throw new Error(
        `PackageJson#removeDependency: Invalid field specified '${field}'. Valid fields: ${dependencyFields.join(
          ", "
        )}`
      );
    }

    const dependencies = this.workingContents[field];

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
    }

    if (this.options.writeImmediately === true) {
      this.write();
      changelogEntry.written = true;
    }

    this.changelog.push(changelogEntry);

    return changelogEntry;
  }

  /**
   * ...
   *
   * @param {object} options
   * @param {string} options.lifecycleEvent
   * @param {string} options.command
   *
   * @returns {object} - changelog entry
   */
  requireScript({ lifecycleEvent, command }) {
    const changelogEntry = {
      event: "requireScript",
      lifecycleEvent,
      alreadyExisted: false,
      written: false
    };

    const scriptsFieldExists =
      typeof this.workingContents.scripts !== "undefined";

    if (!scriptsFieldExists) {
      this.workingContents.scripts = {};
    }

    const scripts = this.workingContents.scripts;

    const lifecycleEventAlreadyExists =
      typeof scripts[lifecycleEvent] !== "undefined";

    changelogEntry.alreadyExisted = lifecycleEventAlreadyExists;

    scripts[lifecycleEvent] = command;

    if (this.options.writeImmediately === true) {
      this.write();
      changelogEntry.written = true;
    }

    this.changelog.push(changelogEntry);

    return changelogEntry;
  }

  /**
   *
   * @param {object} options
   * @param {string} options.lifecycleEvent
   *
   * @returns {object} - changelog entry
   */
  removeScript({ lifecycleEvent }) {
    // TODO: Implement
  }

  /**
   * ...
   *
   * @returns {Array<object>}
   */
  getChangelog() {
    return this.changelog;
  }

  /**
   * ...
   *
   * @returns {Array<string>}
   */
  getChangelogAsMessages() {
    return this.changelog.map(entry => this.getChangelogEntryAsMessage(entry));
  }

  /**
   * ...
   *
   * @returns {string}
   */
  getChangelogEntryAsMessage(entry) {
    // TODO: Check message function exists
    return changelogMessages[entry.event](entry);
  }

  /**
   * ...
   *
   * @returns {object}
   */
  getLastChangelogEntry() {
    return this.changelog[this.changelog.length - 1];
  }

  /**
   * ...
   *
   * @returns {string}
   */
  getLastChangelogEntryAsMessage() {
    return this.getChangelogEntryAsMessage(this.getLastChangelogEntry());
  }
}

module.exports = PackageJson;
