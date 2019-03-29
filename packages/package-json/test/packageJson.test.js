const loadPackageJson = require("../src/index.new.js");

let packageJson;

beforeEach(() => {
  packageJson = loadPackageJson({
    filepath: `${__dirname}/testPackageJson.json`
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
    expect(packageJson.getDocument()).toMatchSnapshot();
  });

  test("logs a field to create if field does not exist", () => {
    const changelogEntry = packageJson.setField("private", true);
    expect(changelogEntry).toMatchSnapshot();
    expect(changelogEntry.previousValue).toEqual(undefined);
    expect(packageJson.getDocument()).toMatchSnapshot();
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
    expect(packageJson.getDocument()).toMatchSnapshot();
  });

  test("creates new dependency if absent", () => {
    const changelogEntry = packageJson.requireDependency({
      pkg: "ebi",
      version: "1.1.0",
      field: "devDependencies"
    });
    expect(changelogEntry).toMatchSnapshot();
    expect(changelogEntry.previousVersionRange).toEqual(undefined);
    expect(packageJson.getDocument()).toMatchSnapshot();
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

  test("throws error if pkg does not exist", () => {
    expect(() => {
      packageJson.removeDependency({
        pkg: "ebi",
        version: "1.1.0",
        field: "devDependencies"
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

    expect(packageJson.getDocument()).toMatchSnapshot();
  });
});

describe("requireScript", () => {
  test("creates new script if absent", () => {
    const changelogEntry = packageJson.requireScript({
      lifecycleEvent: "unit-test",
      command: "test"
    });
    expect(changelogEntry).toMatchSnapshot();
    expect(changelogEntry.alreadyExisted).toEqual(false);
    expect(changelogEntry.lifecycleEvent).toEqual("unit-test");
    expect(packageJson.getDocument()).toMatchSnapshot();
  });

  test("creates new script if no previous scripts", () => {
    const packageJsonWithoutScripts = loadPackageJson({
      filepath: `${__dirname}/testPackageJsonNoScripts.json`
    });
    const changelogEntry = packageJsonWithoutScripts.requireScript({
      lifecycleEvent: "test",
      command: "npm run unit-test"
    });
    expect(changelogEntry).toMatchSnapshot();
    expect(changelogEntry.alreadyExisted).toEqual(false);
    const workingContents = packageJsonWithoutScripts.getDocument();
    expect(workingContents).toMatchSnapshot();
    expect(workingContents.scripts.test).toEqual("npm run unit-test");
  });

  test("replaces script if present", () => {
    const changelogEntry = packageJson.requireScript({
      lifecycleEvent: "test",
      command: "npm run unit-test"
    });
    expect(changelogEntry).toMatchSnapshot();
    expect(changelogEntry.alreadyExisted).toEqual(true);
    expect(changelogEntry.lifecycleEvent).toEqual("test");
    expect(packageJson.getDocument()).toMatchSnapshot();
  });
});
