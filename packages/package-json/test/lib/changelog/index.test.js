const createChangelog = require("../../../src/lib/changelog");

let changelog;

beforeEach(() => {
	changelog = createChangelog();
});

describe("createChangelog", () => {
	test("returns object with methods for manipulating changelog", () => {
		expect(changelog).toEqual(expect.any(Object));
		Object.values(changelog).forEach(method => {
			expect(method).toEqual(expect.any(Function));
		});
	});

	test("throws an error if the `event` value is invalid", () => {
		expect(() => {
			changelog.createEntry({
				event: "invalidEvent",
				field: "license"
			});
		}).toThrowErrorMatchingSnapshot();
	});

	test("throws an error if the `field` property is missing", () => {
		expect(() => {
			changelog.createEntry({
				event: "setField"
			});
		}).toThrowErrorMatchingSnapshot();
	});
});

describe("createEntry", () => {
	test("returns a changelog entry object", () => {
		const changelogEntry = changelog.createEntry({
			event: "setField",
			field: "license"
		});
		expect(changelogEntry).toEqual(expect.any(Object));
		expect(changelogEntry).toMatchSnapshot();
	});
});

describe("get", () => {
	test("returns the changelog as an array of entry objects", () => {
		changelog.createEntry({
			event: "setField",
			field: "name",
			previousValue: "previous-name"
		});
		changelog.createEntry({
			event: "requireDependency",
			field: "dependencies",
			pkg: "express",
			version: "4.16.4"
		});
		const changelogEntries = changelog.get();
		expect(changelogEntries).toEqual(expect.any(Array));
		expect(changelogEntries[0]).toEqual(expect.any(Object));
		expect(changelogEntries).toMatchSnapshot();
	});
});

describe("getAsMessages", () => {
	test("returns the changelog as an array of messages", () => {
		changelog.createEntry({
			event: "setField",
			field: "name",
			alreadyExisted: true
		});
		changelog.createEntry({
			event: "requireDependency",
			field: "dependencies",
			pkg: "express",
			version: "4.16.4"
		});
		const changelogEntries = changelog.get.asMessages();
		expect(changelogEntries).toEqual(expect.any(Array));
		expect(changelogEntries[0]).toEqual(expect.any(String));
		expect(changelogEntries).toMatchSnapshot();
	});
});

describe("getLastEntry", () => {
	test("returns object for last entry in the changelog", () => {
		changelog.createEntry({
			event: "setField",
			field: "name",
			previousValue: "previous-name"
		});
		changelog.createEntry({
			event: "requireDependency",
			field: "dependencies",
			pkg: "express",
			version: "4.16.4"
		});
		const lastChangelogEntry = changelog.get.lastEntry();
		expect(lastChangelogEntry).toEqual(expect.any(Object));
		expect(lastChangelogEntry).toMatchSnapshot();
		expect(lastChangelogEntry).toEqual(changelog.get().pop());
	});

	test("returns an empty object if there are no entries in the changelog", () => {
		expect(changelog.get.lastEntry()).toEqual({});
	});
});

describe("getLastEntryAsMessage", () => {
	test("returns last entry in the changelog as a message", () => {
		changelog.createEntry({
			event: "setField",
			field: "name",
			previousValue: "previous-name"
		});
		changelog.createEntry({
			event: "requireDependency",
			field: "dependencies",
			pkg: "express",
			version: "4.16.4"
		});
		const lastChangelogEntry = changelog.get.lastEntryAsMessage();
		expect(lastChangelogEntry).toEqual(expect.any(String));
		expect(lastChangelogEntry).toMatchSnapshot();
		expect(lastChangelogEntry).toEqual(changelog.get.asMessages().pop());
	});

	test("returns an empty string if there are no entries in the changelog", () => {
		expect(changelog.get.lastEntryAsMessage()).toEqual("");
	});
});
