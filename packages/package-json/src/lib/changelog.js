const { deepCloneObject } = require("./helpers");

module.exports = function createChangelog() {

  const changelog = [];

  function createEntry({ event, meta }) {
    // TODO: Add default properties
    const entry = {
      event,
      alreadyExisted: false,
      previousValue: undefined,
      changeWritten: false,
      meta,
      // field - should this be in meta?
    };

    // TODO: Rename
    const methods = {
      data: {},
      get: (property) => {
        // TODO: Check property exists before attempting to deepCloneObject
        const value = (property) ? entry[property] : entry;
        return deepCloneObject(value);
      },
      set: (property, value) => {
        // TODO: Restrict which properties we can set
        entry[property] = value;
      }
    };

    changelog.push(methods);

    return methods;
  }

  /**
   * Get the raw object for every changelog entry.
   *
   * @returns {Array<object>}
   */
  function get() {
    return changelog.map((entry) => entry.get());
  }

  return {
    createEntry,
    get,
  };
};
