const { deepCloneObject } = require("../helpers");
const messageFormatters = require('./message-formatters');

const changeEvents = [
  'setField',
  'requireDependency',
  'removeDependency',
  'requireScript'
];

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
    if (!changeEvents.includes(event)) {
      throw new Error(`changelog#createEntry: Entry has invalid \`event\` value: ${event}`);
    }
    if (!field) {
      throw new Error('changelog#createEntry: Entry is missing the `field` property');
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
    return changelog.map(entry => messageFormatters.handler(entry));
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
    return messageFormatters.handler(getLastEntry());
  }

  return {
    createEntry,
    get,
    getAsMessages,
    getLastEntry,
    getLastEntryAsMessage
  };
};
