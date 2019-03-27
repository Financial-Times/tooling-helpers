// New usage example:

const loadPackageJson = require('@financial-times/package-json');

const packageJson = loadPackageJson({ filepath: packageJsonFilepath });

packageJson.getField('name');

// Current usage example:

const PackageJson = require('@financial-times/package-json');

const packageJson = new PackageJson({ filepath: '/whatever/path/to/package.json' });

packageJson.getField('name');

// ----

// Existing methods to reimplement:

constructor -> loadPackageJson
// TODO: Check file exists before attempting to read it
// Issue: https://github.com/Financial-Times/tooling-helpers/issues/9
// TODO: Validate `package.json` on load and write ?

+ getField
+ setField
// TODO: Allow to target a deep field
// Issue: https://github.com/Financial-Times/tooling-helpers/issues/55

+ requireDependency
removeDependency

requireScript

+ hasChangesToWrite
+ write

+ deepCloneObject
+ formatObjectAdJson

getChangelog
getChangelogAsMessages
getChangelogEntryAsMessage
getLastChangelogEntry
getLastChangelogEntryAsMessage
// TODO: Move these into their own module

// New methods to implement:

function removeField() {}

/**
 *
 * @param {object} options
 * @param {string} options.lifecycleEvent
 *
 * @returns {object} - changelog entry
 */
function removeScript({ lifecycleEvent }) {}
// Issue: https://github.com/Financial-Times/tooling-helpers/issues/15

/**
 * Returns information about where/if a package exists in the dependencies
 * specified by the `package.json` file.
 *
 * @param {object} options
 * @param {string} options.pkg
 */
function findDependency({ pkg }) {
    /*
    @returns
    [{
        pkg: 'package-name',
        field: 'devDependencies',
        version: '^1.13.2',
        major: 1,
        minor: 13,
        patch: 2
    }]
    */
}
// Issue: https://github.com/Financial-Times/tooling-helpers/issues/12
