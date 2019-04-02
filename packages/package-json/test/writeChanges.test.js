const loadPackageJson = require("../src/index.js");

const { fs, vol } = require('memfs');
process.env.MEMFS_DONT_WARN = true;

jest.mock('fs', () => require('memfs').fs);
const actualFs = jest.requireActual('fs');

let mockFsWriteFileSync;

beforeEach(() => {
    mockFsWriteFileSync = jest.spyOn(fs, 'writeFileSync');

    const fixturePackageJson = `${__dirname}/fixtures/testPackageJson.json`;
    vol.fromJSON({
        'package.json': actualFs.readFileSync(fixturePackageJson, { encoding: 'utf-8' })
    });
});

afterEach(() => {
    vol.reset();
    mockFsWriteFileSync.mockRestore();
    jest.clearAllMocks();
});

describe("writeChanges", () => {

  test("writes package.json document changes to the file system", () => {

    const packageJsonBefore = loadPackageJson({
      filepath: 'package.json'
    });
    
    packageJsonBefore.removeDependency({
      pkg: "prettier",
      field: "devDependencies"
    });

    packageJsonBefore.writeChanges();
    expect(mockFsWriteFileSync).toHaveBeenCalled();

    const packageJsonAfter = loadPackageJson({
        filepath: 'package.json'
    });

    const devDependenciesAfter = packageJsonAfter.getDocument().devDependencies;
    expect(devDependenciesAfter.prettier).toEqual(undefined);

    const packageJsonDocumentBefore = packageJsonBefore.getDocument();
    const packageJsonDocumentAfter = packageJsonAfter.getDocument();
    expect(packageJsonDocumentBefore).toEqual(packageJsonDocumentAfter);
  });

  test("throws an error if it is unable to write to the package.json file", () => {

    mockFsWriteFileSync.mockImplementation((filepath) => {
        throw new Error(`EACCES: permission denied, open '${filepath}'`);
    });

    const packageJson = loadPackageJson({
      filepath: 'package.json'
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
