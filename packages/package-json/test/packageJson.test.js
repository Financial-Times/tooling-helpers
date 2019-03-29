const loadPackageJson = require("../src/index.new.js");

let packageJson;

beforeEach(() => {
  packageJson = loadPackageJson({
    filepath: "./package-json/test/testPackageJson.json"
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
    expect(packageJson.getWorkingContents()).toMatchSnapshot();
  });

  test("logs a field to create if field does not exist", () => {
    const changelogEntry = packageJson.setField("private", true);
    expect(changelogEntry).toMatchSnapshot();
    expect(changelogEntry.previousValue).toEqual(undefined);
    expect(packageJson.getWorkingContents()).toMatchSnapshot();
  });
});

describe("requireDependency", () => {
  test("throws error if dependencyField does not exist", () => {
    expect(() => {
      packageJson.requireDependency({
        pkg: "ebi",
        version: "1.1.0",
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
    expect(changelogEntry.previousVersionRange).toEqual("1.16.3");
    expect(packageJson.getWorkingContents()).toMatchSnapshot();
  });

  test("creates new dependency if absent", () => {
    const changelogEntry = packageJson.requireDependency({
      pkg: "ebi",
      version: "1.1.0",
      field: "devDependencies"
    });
    expect(changelogEntry).toMatchSnapshot();
    expect(changelogEntry.previousVersionRange).toEqual(undefined);
    expect(packageJson.getWorkingContents()).toMatchSnapshot();
  });
});

describe("removeDependency", () => {
  test("throws error if dependencyField does not exist", () => {
    expect(() => {
      packageJson.removeDependency({
        pkg: "ebi",
        version: "1.1.0",
        field: "testDependencies"
      });
    }).toThrowErrorMatchingSnapshot();
  });

  test("removes existing pkg", () => {
    const changelogEntry = packageJson.removeDependency({
      pkg: "prettier",
      field: "devDependencies"
    });
    expect(changelogEntry).toMatchSnapshot();
    expect(changelogEntry.version).toEqual("1.16.3");
    expect(changelogEntry.pkg).toEqual("prettier");

    expect(packageJson.getWorkingContents()).toMatchSnapshot();
  });

  test("throws error if pkg does not exist", () => {
    expect(() => {
      packageJson.removeDependency({
        pkg: "ebi",
        version: "1.1.0",
        field: "devDependencies"
      });
    }).toThrowErrorMatchingSnapshot();
  });
});

//   Write tests for requireScript
