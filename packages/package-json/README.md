# package-json

This library allows you to load, manipulate and write the contents of
a [`package.json`](https://docs.npmjs.com/files/package.json.html) file.
It also provides a [changelog](#getChangelog) detailing any changes
that have been made.

# Usage

```
npm install @financial-times/package-json
```

## loadPackageJson

After loading the specified `package.json` file into memory, the `loadPackageJson` method returns a collection of methods that can be used for changing the `package.json` document and writing those changes back to disk.

```javascript
const loadPackageJson = require("@financial-times/package-json");
const packageJson = loadPackageJson({ filepath: `filepath/to/package.json` });
```

Methods returned:

- [get](#get)
- [hasChangesToWrite](#hasChangesToWrite)
- [writeChanges](#writeChanges)
- [getField](#getField)
- [setField](#setField)
- [requireDependency](#requireDependency)
- [removeDependency](#removeDependency)
- [requireScript](#requireScript)
- [getChangelog](#getChangelog)

### get

Returns an object representing the current working state of the `package.json` document. This may be different to what exists on the file system if changes have not yet been written by calling the `writeChanges` method.

```javascript
packageJson.get();
```

### hasChangesToWrite

Checks if there are file changes to write.

```javascript
packageJson.hasChangesToWrite(); // true or false
```


### writeChanges

Writes to the `package.json` file.

```javascript
packageJson.writeChanges(); // true
```

### getField

Gets a specific field from the `package.json` object, by passing the field as an argument.

```javascript
packageJson.getField("name"); // "@financial-times/package-json"
```

### setField

Sets the value for a specific field in the `package.json` object and returns a changelog entry.

```javascript
packageJson.setField("name", "newName");
```

Returns a changelog entry object:

```json
{
  "event": "setField",
  "field": "name",
  "meta": {},
  "previousValue": "oldName",
  "alreadyExisted": false
}
```

### requireDependency

Requires a package to exist as a dependency in `package.json`.

```javascript
packageJson.requireDependency({
  pkg: "prettier",
  version: "1.16.4",
  field: "devDependencies"
});
```

Returns a changelog entry object:

```json
{
  "event": "requireDependency",
  "field": "devDependencies",
  "meta": {
    "pkg": "prettier",
    "version": "1.16.4"
  },
  "previousValue": "1.16.3",
  "alreadyExisted": true
}
```

### removeDependency

Removes a package as a dependency from `package.json`.

```javascript
packageJson.removeDependency({
  pkg: "prettier",
  version: "1.16.4",
  field: "devDependencies"
});
```

Returns a changelog entry object, or `false` if the dependency doesn't exist:

```json
{
  "event": "removeDependency",
  "field": "devDependencies",
  "meta": {
    "pkg": "prettier"
  },
  "previousValue": "1.16.3",
  "alreadyExisted": true
}
```

### requireScript

Requires a script to exist in the `scripts` field of `package.json`.

```javascript
packageJson.requireScript({
  stage: "test",
  command: "npm run unit-test"
});
```

Returns a changelog entry object:

```json
{
  "event": "requireScript",
  "field": "scripts",
  "meta": {
    "stage": "test"
  },
  "alreadyExisted": true
}
```

### getChangelog

The changelog represents all the changes that have been made to the `package.json`
object, regardless of whether they have yet been written to the file.

The changelog is made up of entry objects, which all have the following properties:

- `event` - The type of event i.e. `setField`, `requireDependency`, `removeDependency` or `requireScript`
- `field` - The field in `package.json` that was changed
- `alreadyExisted` - Flag whether the field already existed
- `previousValue` - Previous value of the field
- `meta` - An object containing extra details about the change e.g. `pkg`, `version`, `stage`

You can access the changelog entries with the following methods:

- `getChangelog()`
- `getChangelog.asMessages()`
- `getChangelog.lastEntry()`
- `getChangelog.lastEntryAsMessage()`

**Examples of working with the changelog**

```javascript
packageJson.requireDependency({
  pkg: "prettier",
  version: "1.16.4",
  field: "devDependencies"
});

packageJson.requireScript({
  stage: "test",
  command: "npm run unit-test"
});

const changelogObjects = packageJson.getChangelog();

/*
[
  {
    event: "requireDependency",
    field: "devDependencies",
    meta: {
      pkg: "prettier",
      version: "1.16.4"
    },
    previousValue: "1.16.3",
    alreadyExisted: true
  },
  {
    event: "requireScript",
    field: "scripts",
    meta: {
      stage: "test"
    },
    alreadyExisted: true
  }
]
*/

const changelogMessages = packageJson.getChangelog.asMessages();

/*
[
  "Required package prettier@1.16.4 in devDependencies, previously 1.16.3",
  "Required script for stage 'test' (overwrote existing command)"
]
*/

const lastChangelogEntryObject = packageJson.getChangelog.lastEntry();

/*
{
  event: "requireScript",
  field: "scripts",
  meta: {
    stage: "test"
  },
  alreadyExisted: true
}
*/

const lastChangelogEntryMessage = packageJson.getChangelog.lastEntryAsMessage();

// "Required script for stage 'test' (overwrote existing command)"
```
