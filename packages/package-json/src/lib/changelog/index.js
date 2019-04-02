const { deepCloneObject } = require("./helpers");

/**
 * Functions for creating human-friendly messages from changelog objects.
 */
// TODO: Write tests for these
const messageFormatters = {
  setField: ({ field, previousValue }) => {
    let message = `Set value for field '${field}'`;
    message += previousValue
      ? ` (overwrote existing value)`
      : " (new field)";
    return message;
  },
  requireDependency: ({ field, previousVersionRange, meta }) => {
    let message = `Required package ${meta.pkg}@${meta.version} in ${field}`;
    message += previousVersionRange
      ? `, previously ${previousVersionRange}`
      : " (new dependency)";
    return message;
  },
  removeDependency: ({ field, meta }) => {
    let message = `Removed package ${meta.pkg} from ${field}`;
    return message;
  },
  requireScript: ({ alreadyExisted, meta }) => {
    let message = `Required script for lifecycle event '${meta.lifecycleEvent}'`;
    message += alreadyExisted
      ? ` (overwrote existing command)`
      : " (new script)";
    return message;
  }
};

const eventTypes = Object.keys(messageFormatters);

/**
 * Format a changelog entry as a human-friendly message.
 *
 * @returns {string}
 */
// TODO: Write tests
function formatEntryAsMessage(entry) {
  return messageFormatters[entry.event](entry);
}

module.exports = function createChangelog() {

  const changelog = [];

  /**
   * Create a new changelog entry.
   *
   * @param {object} entry 
   * @param {string} entry.event - ??
   * @param {string} entry.field - ??
   * @param {string} [entry.alreadyExisted] - ??
   * @param {string} [entry.previousValue] - ??
   * @param {*} [entry.*] - ??
   */
  function createEntry({
    event,
    field,
    alreadyExisted = false,
    previousValue = undefined,
    ...meta
  }) {
    if (!eventTypes.includes(event)) {
      throw new Error(`changelog#createEntry: Entry has invalid \`event\` type: ${event}`);
    }
    if (!field) {
      throw new Error('changelog#createEntry: Entry is missing a `field` option');
    }

    const entry = {
      event,
      field,
      meta,
      previousValue,
      alreadyExisted,
      // TODO: Is this worth keeping?
      changeWritten: false
    };

    changelog.push(entry);

    return deepCloneObject(entry);
  }

  /**
   * Get all changelog entry objects.
   *
   * @returns {Array<object>}
   */
  function get() {
    return deepCloneObject(changelog);
  }

  /**
   * Get all changelog entries as human-friendly messages.
   *
   * @returns {Array<string>}
   */
  function getAsMessages() {
    return changelog.map(entry => formatEntryAsMessage(entry));
  }

  /**
   * Get last changelog entry object.
   *
   * @returns {object}
   */
  function getLastEntry() {
    if (changelog.length === 0) {
      return {};
    }
    return deepCloneObject(changelog[changelog.length - 1]);
  }

  /**
   * Get last changelog entry as a human-friendly message.
   *
   * @returns {string}
   */
  function getLastEntryAsMessage() {
    return formatEntryAsMessage(getLastEntry());
  }

  return {
    createEntry,
    get,
    getAsMessages,
    getLastEntry,
    getLastEntryAsMessage
  };
};
