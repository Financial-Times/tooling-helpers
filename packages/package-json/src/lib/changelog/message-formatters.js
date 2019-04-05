/**
 * Methods for creating human-friendly messages from changelog entry objects.
 *
 * @namespace messageFormatters
 */

/**
 * Invoke a message formatter based on the value of a changelog entry's `event`.
 *
 * @memberof messageFormatters
 * @function handler
 * @param {object} entry - Changelog entry object
 * @returns {string}
 */
exports.handler = entry => {
	const messageFormatter = exports[entry.event];
	if (typeof messageFormatter !== "function") {
		throw new Error(
			`message-formatters#handler: There is no message formatter defined for the \`event\` '${
				entry.event
			}'`
		);
	}
	return messageFormatter(entry);
};

/**
 * Format a `setField` changelog entry object as a human-friendly message.
 *
 * @memberof messageFormatters
 * @function setField
 * @param {object} options
 * @param {string} options.field
 * @param {boolean} options.alreadyExisted
 * @returns {string}
 */
exports.setField = ({ field, alreadyExisted }) => {
	let message = `Set value for field '${field}'`;
	message += alreadyExisted ? ` (overwrote existing value)` : " (new field)";
	return message;
};

/**
 * Format a `requireDependency` changelog entry object as a human-friendly message.
 *
 * @memberof messageFormatters
 * @function requireDependency
 * @param {object} options
 * @param {string} options.field
 * @param {*} options.previousValue
 * @param {object} options.meta
 * @param {string} options.meta.pkg
 * @param {string} options.meta.version
 * @returns {string}
 */
exports.requireDependency = ({ field, previousValue = undefined, meta }) => {
	let message = `Required package ${meta.pkg}@${meta.version} in ${field}`;
	message += previousValue
		? `, previously ${previousValue}`
		: " (new dependency)";
	return message;
};

/**
 * Format a `removeDependency` changelog entry object as a human-friendly message.
 *
 * @memberof messageFormatters
 * @function removeDependency
 * @param {object} options
 * @param {string} options.field
 * @param {object} options.meta
 * @param {string} options.meta.pkg
 * @returns {string}
 */
exports.removeDependency = ({ field, meta }) => {
	let message = `Removed package ${meta.pkg} from ${field}`;
	return message;
};

/**
 * Format a `requireScript` changelog entry object as a human-friendly message.
 *
 * @memberof messageFormatters
 * @function requireScript
 * @param {object} options
 * @param {boolean} options.alreadyExisted
 * @param {object} options.meta
 * @param {string} options.meta.stage
 * @returns {string}
 */
exports.requireScript = ({ alreadyExisted, meta }) => {
	let message = `Required script for stage '${meta.stage}'`;
	message += alreadyExisted ? ` (overwrote existing command)` : " (new script)";
	return message;
};
