/**
 * Deep clone a JavaScript object.
 *
 * @param {object} object
 */
exports.deepCloneObject = (object) => JSON.parse(JSON.stringify(object));

/**
 * Convert a JavaScript object to a formatted JSON string.
 *
 * @param {object} object
 * @returns {string}
 */
exports.formatObjectAsJson = (object) => JSON.stringify(object, null, 2);
