/**
 * @namespace helpers
 */

/**
 * Deep clone a JavaScript object.
 *
 * @memberof helpers
 * @function deepCloneObject
 * @param {object} object
 */
exports.deepCloneObject = object => JSON.parse(JSON.stringify(object));

/**
 * Convert a JavaScript object to a formatted JSON string.
 *
 * This helper method formats JSON strings with two space indentation in order
 * to be consistent with how the `npm` CLI formats `package.json` files.

 * @see https://github.com/npm/cli
 *
 * @memberof helpers
 * @function formatObjectAsJson
 * @param {object} object
 * @returns {string}
 */
exports.formatObjectAsJson = object => JSON.stringify(object, null, 2);
