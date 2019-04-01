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
    test('return a changelog object', () => {
        const changelogEntry = changelog.createEntry({
            event: 'setField'
        });
        expect(changelogEntry).toEqual(expect.any(Object));
    });
});

describe('changelog object', () => {
    // TODO: Rename
    test('get method returns raw changelog object', () => {
        const changelogEntry = changelog.createEntry({
            event: 'setField'
        });
        expect(changelogEntry.get()).toEqual({
            event: 'setField',
            alreadyExisted: false,
            changeWritten: false,
            previousValue: undefined
        });
    });
    // TODO: Rename
    test('get method returns changelog field', () => {
        const changelogEntry = changelog.createEntry({
            event: 'setField'
        });
        expect(changelogEntry.get('event')).toEqual('setField');
    });
    test('set method changes a field in the changelog entry', () => {
        const changelogEntry = changelog.createEntry({
            event: 'setField',
            meta: {
              field: 'license'
            }
        });
        changelogEntry.set('previousValue', 'MIT');
        expect(changelogEntry.get('previousValue')).toEqual('MIT');
    });
});

describe('getChangelog', () => {
    test('returns an array of raw changelog objects', () => {
        changelog.createEntry({ event: 'setField' });
        const changelogEntries = changelog.get();
        expect(changelogEntries).toEqual(expect.any(Array));
        expect(changelogEntries).toMatchSnapshot();
    });
});