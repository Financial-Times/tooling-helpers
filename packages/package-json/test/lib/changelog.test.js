const createChangelog = require('../../src/lib/changelog');

let changelog;

beforeEach(() => {
    changelog = createChangelog();
});

describe('createChangelog', () => {
    test('returns object with methods for manipulating changelog', () => {
        expect(changelog).toEqual(expect.any(Object));
        Object.values(changelog).forEach((method) => {
            expect(method).toEqual(expect.any(Function));
        });
    });
});

describe('createEntry', () => {
    test('returns a changelog object', () => {
        const changelogEntry = changelog.createEntry({
            event: 'setField'
        });
        expect(changelogEntry).toEqual(expect.any(Object));
        expect(changelogEntry).toEqual({
            event: 'setField',
            alreadyExisted: false,
            changeWritten: false,
            previousValue: undefined,
            meta: {}
        });
    });
});

describe('get', () => {
    test('returns an array of changelog objects', () => {
        changelog.createEntry({ event: 'setField' });
        const changelogEntries = changelog.get();
        expect(changelogEntries).toEqual(expect.any(Array));
        expect(changelogEntries).toMatchSnapshot();
    });
});

describe.skip('getAsMessages', () => {
    test('...', () => {

    });
});

describe.skip('getLastEntry', () => {
    test('...', () => {

    });
});

describe.skip('getLastEntryAsMessage', () => {
    test('...', () => {

    });
});
