/**
 * These tests for the `writeChanges` method are separate from the tests for
 * the other methods as we're mocking out Node.js' `fs` module using
 * `memfs`. This is so that we can test writing changes to the file system.
 * This doesn't play well with the other tests that we want to use the real
 * `fs` module.
 */

const loadPackageJson = require("../src/index.js");

process.env.MEMFS_DONT_WARN = true;
const { fs, vol } = require("memfs");

jest.mock("fs", () => require("memfs").fs);
const actualFs = jest.requireActual("fs");

let mockFsWriteFileSync;

beforeEach(() => {
	mockFsWriteFileSync = jest.spyOn(fs, "writeFileSync");

	vol.fromJSON(
		{
			"./package.json": actualFs.readFileSync(
				`${__dirname}/fixtures/test-package.json`,
				{ encoding: "utf-8" }
			)
		},
		"/app"
	);
});

afterEach(() => {
	vol.reset();
	mockFsWriteFileSync.mockRestore();
	jest.clearAllMocks();
});

describe("writeChanges", () => {
	test("writes package.json document changes to the file system", () => {
		const packageJsonBefore = loadPackageJson({
			filepath: "/app/package.json"
		});

		packageJsonBefore.removeDependency({
			pkg: "prettier",
			field: "devDependencies"
		});

		packageJsonBefore.writeChanges();
		expect(mockFsWriteFileSync).toHaveBeenCalled();

		const packageJsonAfter = loadPackageJson({
			filepath: "/app/package.json"
		});

		const devDependenciesAfter = packageJsonAfter.get().devDependencies;
		expect(devDependenciesAfter.prettier).toEqual(undefined);

		const packageJsonDocumentBefore = packageJsonBefore.get();
		const packageJsonDocumentAfter = packageJsonAfter.get();
		expect(packageJsonDocumentBefore).toEqual(packageJsonDocumentAfter);
	});

	test("throws an error if it is unable to write to the package.json file", () => {
		mockFsWriteFileSync.mockImplementation(filepath => {
			throw new Error(`EACCES: permission denied, open '${filepath}'`);
		});

		const packageJson = loadPackageJson({
			filepath: "/app/package.json"
		});

		packageJson.removeDependency({
			pkg: "prettier",
			field: "devDependencies"
		});

		expect(() => {
			packageJson.writeChanges();
		}).toThrowErrorMatchingSnapshot();

		expect(mockFsWriteFileSync).toHaveBeenCalled();
	});
});
