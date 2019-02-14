let defaults;

beforeEach(() => {
    /**
     * The `defaults` module has local state, so we need to isolate it for
     * every test.
     * @see https://jestjs.io/docs/en/jest-object#jestisolatemodulesfn
     */
    jest.isolateModules(() => {
        defaults = require('../../src/helpers/defaults');
    });
});

test('`defaults()` throws a TypeError when called with no arguments', () => {
    expect(() => {
        defaults();
    }).toThrowError(TypeError);
});

test('`defaults()` does not error or change anything when called with empty options object', () => {
    expect(() => {
        defaults({});
    }).not.toThrowError();

    expect(defaults.workingDirectory).toEqual(process.cwd());
});

test('`defaults.workingDirectory` is updated when `workingDirectory` is passed as an option to `defaults()`', () => {
    defaults({ workingDirectory: '/tmp/repository' });

    expect(defaults.workingDirectory).toEqual('/tmp/repository');
});

/**
 * This test checks the default state of the `defaults` module. It is after all
 * the others to ensure that the `defaults` module is being correctly isolated
 * for each test.
 */
test('default value for `defaults.workingDirectory` is current working directory for node process', () => {
    expect(defaults.workingDirectory).toEqual(process.cwd());
});
