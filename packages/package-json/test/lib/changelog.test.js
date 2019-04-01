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
            changeWritten: false
        });
    });
    // TODO: Rename
    test('get method returns changelog field', () => {
        const changelogEntry = changelog.createEntry({
            event: 'setField'
        });
        expect(changelogEntry.get('event')).toEqual('setField');
    });
});