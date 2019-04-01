const { deepCloneObject } = require("./helpers");

module.exports = function createChangelog() {

  function createEntry({ event }) {
    const entry = {
      event,
      changeWritten: false
    };

    return {
      get: (property) => {
        const value = (property) ? entry[property] : entry;
        return deepCloneObject(value);
      }
    };
  }
  return {createEntry};
};
