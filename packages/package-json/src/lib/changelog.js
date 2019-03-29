/**
 * Functions for creating human-friendly messages from changelog objects.
 */
const createChangelogMessage = {
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
  },
  fallback: (entry) => {
    return JSON.stringify(entry);
  }
};

const changelog = [];

  function add() {

  }

  /**
   * Get all changelog entry objects.
   *
   * @returns {Array<object>}
   */
  function getChangelog() {
    return this.changelog;
  }

  /**
   * Get all changelog entries as human-friendly messages.
   *
   * @returns {Array<string>}
   */
  function getChangelogAsMessages() {
    return this.changelog.map(entry => this.getChangelogEntryAsMessage(entry));
  }

  /**
   * Format a changelog entry as a human-friendly message.
   *
   * @returns {string}
   */
  function getChangelogEntryAsMessage(entry) {
    if (!createChangelogMessage[entry.event]) {
      return createChangelogMessage.fallback(entry);
    }

    return createChangelogMessage[entry.event](entry);
  }

  /**
   * Get last changelog entry object.
   *
   * @returns {object}
   */
  function getLastChangelogEntry() {
    return this.changelog[this.changelog.length - 1];
  }

  /**
   * Get last changelog entry as a human-friendly message.
   *
   * @returns {string}
   */
  function getLastChangelogEntryAsMessage() {
    return this.getChangelogEntryAsMessage(this.getLastChangelogEntry());
  }
