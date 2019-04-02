const { deepCloneObject } = require("./helpers");

/**
 * Functions for creating human-friendly messages from changelog objects.
 */
const events = {
  setField: {
    formatAsMessage: ({ field, previousValue }) => {
      let message = `Set value for field '${field}'`;
      message += previousValue
        ? ` (overwrote existing value)`
        : " (new field)";
      return message;
    }
  },
  requireDependency: {
    formatAsMessage: ({ pkg, field, version, previousVersionRange }) => {
      let message = `Required package ${pkg}@${version} in ${field}`;
      message += previousVersionRange
        ? `, previously ${previousVersionRange}`
        : " (new dependency)";
      return message;
    }
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

const eventTypes = Object.keys(events);

/**
 * Format a changelog entry as a human-friendly message.
 *
 * @returns {string}
 */
// TODO: Write tests
function formatEntryAsMessage(entry) {
  return events[entry.event].formatAsMessage(entry);
}

module.exports = function createChangelog() {

  const changelog = [];

  function createEntry({
    event,
    field,
    alreadyExisted = false,
    previousValue = undefined,
    ...meta
  }) {
    if (!eventTypes.includes(event)) {
      throw new Error(`changelog: Invalid event type: ${event}`);
    }

    const entry = {
      event,
      field,
      meta,
      previousValue,
      alreadyExisted,
      changeWritten: false
    };

    changelog.push(entry);

    return deepCloneObject(entry);
  }

  /**
   * Get all changelog entries.
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
  // TODO: Write tests
  function getAsMessages() {
    return changelog.map(entry => formatEntryAsMessage(entry));
  }

  /**
   * Get last changelog entry object.
   *
   * @returns {object}
   */
  // TODO: Write tests
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
  // TODO: Write tests
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
