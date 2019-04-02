const loadPackageJson = require("../src/index.js");

const { fs, vol } = require('memfs');
const actualFs = jest.requireActual('fs');

jest.mock('fs', () => require('memfs').fs);

let mockFsWriteFileSync;

beforeEach(() => {
    mockFsWriteFileSync = jest.spyOn(fs, 'writeFileSync');

    const fixturePackageJson = `${__dirname}/fixtures/testPackageJson.json`;
    const volume = {
        'package.json': actualFs.readFileSync(fixturePackageJson, { encoding: 'utf-8' })
    };
    vol.fromJSON(volume);
});

afterEach(() => {
    mockFsWriteFileSync.mockRestore();
    jest.clearAllMocks();
});

describe.only("writeChanges", () => {

  test("writes updated package.json document to the file system", () => {

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

});
