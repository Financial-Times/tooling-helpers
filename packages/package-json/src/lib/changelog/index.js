const { deepCloneObject } = require("../helpers");
const messageFormatters = require("./message-formatters");

const changeEvents = [
	"setField",
	"requireDependency",
	"removeDependency",
	"requireScript"
];

module.exports = function createChangelog() {
	const changelog = [];

	/**
	 * Create a new changelog entry.
	 *
	 * @param {object} entry
	 * @param {string} entry.event - Type of event
	 * @param {string} entry.field - Field in `package.json` that is being changed
	 * @param {boolean} [entry.alreadyExisted] - Flag whether the field already existed (default: false)
	 * @param {string} [entry.previousValue] - Previous value of the field (default: undefined)
	 * @param {*} [entry.*] - Any other properties you add will be stored in the changelog event's `meta` object
	 */
	function createEntry({
		event,
		field,
		alreadyExisted = false,
		previousValue = undefined,
		...meta
	}) {
		if (!changeEvents.includes(event)) {
			throw new Error(
				`changelog#createEntry: Entry has invalid \`event\` value: ${event}`
			);
		}
		if (!field) {
			throw new Error(
				"changelog#createEntry: Entry is missing the `field` property"
			);
		}

		const entry = {
			event,
			field,
			meta,
			previousValue,
			alreadyExisted
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
	get.asMessages = function() {
		return changelog.map(entry => messageFormatters.handler(entry));
	};

	/**
	 * Get last changelog entry object.
	 *
	 * @returns {object}
	 */
	get.lastEntry = function() {
		if (changelog.length === 0) {
			return {};
		}
		return deepCloneObject(changelog[changelog.length - 1]);
	};

	/**
	 * Get last changelog entry as a human-friendly message.
	 *
	 * @returns {string}
	 */
	get.lastEntryAsMessage = function() {
		if (!get.lastEntry().event) {
			return "";
		}
		return messageFormatters.handler(get.lastEntry());
	};

	return {
		createEntry,
		get
	};
};
