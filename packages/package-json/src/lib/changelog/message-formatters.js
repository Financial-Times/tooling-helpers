/**
 * Invoke a message formatter based on the value of a changelog entry's `event`.
 *
 * @returns {string}
 */
exports.handler = entry => {
  const messageFormatter = exports[entry.event];
  if (typeof messageFormatter !== 'function') {
    throw new Error(
      `message-formatters#handler: There is no message formatter defined for the \`event\` '${
        entry.event
      }'`
    );
  }
  return messageFormatter(entry);
};

/**
 * Methods for creating human-friendly messages from changelog entry objects.
 */

exports.setField = ({ field, previousValue }) => {
  let message = `Set value for field '${field}'`;
  message += previousValue ? ` (overwrote existing value)` : " (new field)";
  return message;
};

exports.requireDependency = ({ field, previousVersionRange, meta }) => {
  let message = `Required package ${meta.pkg}@${meta.version} in ${field}`;
  message += previousVersionRange
    ? `, previously ${previousVersionRange}`
    : " (new dependency)";
  return message;
};

exports.removeDependency = ({ field, meta }) => {
  let message = `Removed package ${meta.pkg} from ${field}`;
  return message;
};

exports.requireScript = ({ alreadyExisted, meta }) => {
  let message = `Required script for lifecycle event '${meta.lifecycleEvent}'`;
  message += alreadyExisted ? ` (overwrote existing command)` : " (new script)";
  return message;
};
