const loadPackageJson = require("../src/index.js");

let packageJson;

beforeEach(() => {
	packageJson = loadPackageJson({
		filepath: `${__dirname}/fixtures/test-package.json`
	});
});

describe("loadPackageJson", () => {
	test("throws an error if the `filepath` option is missing", () => {
		expect(() => {
			loadPackageJson();
		}).toThrowErrorMatchingSnapshot();
	});

	test("throws an error if is unable to read the specified file", () => {
		expect(() => {
			loadPackageJson({
				filepath: "/app/non-existent-package.json"
			});
		}).toThrowErrorMatchingSnapshot();
	});

	test("throws an error if is unable to parse the specified file as JSON", () => {
		/**
		 * We can't use `toThrowErrorMatchingSnapshot` here as the filepath in
		 * the error message is absolute, so it will be different in every
		 * environment that these tests are run on.
		 */
		expect(() => {
			loadPackageJson({
				filepath: `${__dirname}/fixtures/bad-package.json`
			});
		}).toThrowError();
	});

	test("returns object with methods for manipulating package.json", () => {
		const packageJson = loadPackageJson({
			filepath: `${__dirname}/fixtures/test-package.json`
		});
		expect(packageJson).toEqual(expect.any(Object));
		Object.values(packageJson).forEach(method => {
			expect(method).toEqual(expect.any(Function));
		});
	});

	test("loads the specified package.json file", () => {
		const packageJson = loadPackageJson({
			filepath: `${__dirname}/fixtures/test-package.json`
		});
		expect(packageJson.get().name).toEqual("ebi");
		expect(packageJson.get()).toMatchSnapshot();
	});
});

describe("get", () => {
	test("returns an object that represents the working state of the `package.json` object", () => {
		expect(packageJson.get()).toMatchSnapshot();

		packageJson.setField("name", "ebi v2");
		expect(packageJson.get().name).toEqual("ebi v2");
	});
});

describe("hasChangesToWrite", () => {
	test("returns true when there are pending changes to write to package.json", () => {
		packageJson.removeDependency({
			pkg: "prettier",
			field: "devDependencies"
		});
		expect(packageJson.hasChangesToWrite()).toEqual(true);
	});

	test("returns false when there are no pending changes to write to package.json", () => {
		expect(packageJson.hasChangesToWrite()).toEqual(false);
	});
});

describe("getField", () => {
	test("returns field contents if field exists", () => {
		expect(packageJson.getField("name")).toEqual("ebi");
	});

	test("returns undefined if field does not exist", () => {
		expect(packageJson.getField("private")).toEqual(undefined);
	});
});

describe("setField", () => {
	test("logs a field to write if field exists", () => {
		const changelogEntry = packageJson.setField("name", "ebi v2");
		expect(changelogEntry).toMatchSnapshot();
		expect(packageJson.get()).toMatchSnapshot();
	});

	test("logs a field to create if field does not exist", () => {
		const changelogEntry = packageJson.setField("private", true);
		expect(changelogEntry).toMatchSnapshot();
		expect(changelogEntry.previousValue).toEqual(undefined);
		expect(packageJson.get()).toMatchSnapshot();
	});
});

describe("requireDependency", () => {
	test("throws error if dependencyField does not exist", () => {
		expect(() => {
			packageJson.requireDependency({
				pkg: "jest",
				version: "24.0.0",
				field: "testDependencies"
			});
		}).toThrowErrorMatchingSnapshot();
	});

	test("updates version of existing dependency", () => {
		const changelogEntry = packageJson.requireDependency({
			pkg: "prettier",
			version: "1.16.4",
			field: "devDependencies"
		});
		expect(changelogEntry).toMatchSnapshot();
		expect(changelogEntry.previousValue).toEqual("1.16.3");
		expect(packageJson.get()).toMatchSnapshot();
	});

	test("creates new dependency if absent", () => {
		const changelogEntry = packageJson.requireDependency({
			pkg: "nock",
			version: "10.0.6",
			field: "devDependencies"
		});
		expect(changelogEntry).toMatchSnapshot();
		expect(changelogEntry.alreadyExisted).toEqual(false);
		expect(packageJson.get()).toMatchSnapshot();
	});

	test("creates field and new dependency if both are absent", () => {
		const changelogEntry = packageJson.requireDependency({
			pkg: "nock",
			version: "10.0.6",
			field: "peerDependencies"
		});
		expect(changelogEntry).toMatchSnapshot();
		expect(changelogEntry.alreadyExisted).toEqual(false);
		expect(packageJson.get()).toMatchSnapshot();
	});
});

describe("removeDependency", () => {
	test("throws error if `field` is not a valid field for dependencies", () => {
		expect(() => {
			packageJson.removeDependency({
				pkg: "ebi",
				version: "1.1.0",
				field: "testDependencies"
			});
		}).toThrowErrorMatchingSnapshot();
	});

	test("returns boolean false if pkg does not exist", () => {
		expect(
			packageJson.removeDependency({
				pkg: "ebi",
				version: "1.1.0",
				field: "devDependencies"
			})
		).toEqual(false);
	});

	test("returns boolean false if `field` is valid but does not exist", () => {
		expect(
			packageJson.removeDependency({
				pkg: "ebi",
				version: "1.1.0",
				field: "peerDependencies"
			})
		).toEqual(false);
	});

	test("removes existing pkg", () => {
		const changelogEntry = packageJson.removeDependency({
			pkg: "prettier",
			field: "devDependencies"
		});
		expect(changelogEntry).toMatchSnapshot();
		expect(changelogEntry.previousValue).toEqual("1.16.3");
		expect(changelogEntry.meta.pkg).toEqual("prettier");

		expect(packageJson.get()).toMatchSnapshot();
	});
});

describe("requireScript", () => {
	test("creates new script if absent", () => {
		const changelogEntry = packageJson.requireScript({
			stage: "unit-test",
			command: "test"
		});
		expect(changelogEntry).toMatchSnapshot();
		expect(changelogEntry.alreadyExisted).toEqual(false);
		expect(changelogEntry.meta.stage).toEqual("unit-test");
		expect(packageJson.get()).toMatchSnapshot();
	});

	test("creates new script if no previous scripts", () => {
		const packageJsonWithoutScripts = loadPackageJson({
			filepath: `${__dirname}/fixtures/test-no-scripts-package.json`
		});
		const changelogEntry = packageJsonWithoutScripts.requireScript({
			stage: "test",
			command: "npm run unit-test"
		});
		expect(changelogEntry).toMatchSnapshot();
		expect(changelogEntry.alreadyExisted).toEqual(false);
		const workingContents = packageJsonWithoutScripts.get();
		expect(workingContents).toMatchSnapshot();
		expect(workingContents.scripts.test).toEqual("npm run unit-test");
	});

	test("replaces script if present", () => {
		const changelogEntry = packageJson.requireScript({
			stage: "test",
			command: "npm run unit-test"
		});
		expect(changelogEntry).toMatchSnapshot();
		expect(changelogEntry.alreadyExisted).toEqual(true);
		expect(changelogEntry.meta.stage).toEqual("test");
		expect(packageJson.get()).toMatchSnapshot();
	});
});
