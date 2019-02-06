const { GitProcess } = require('dugite');

const { add } = require('../src');

afterEach(() => {
    jest.clearAllMocks();
});

describe('`add` method returns boolean true when given valid options', () => {

    beforeAll(() => {
        GitProcess.exec.mockResolvedValue({
            stdout: "",
            stderr: "",
            exitCode: 0,
        });
    });

    test('files (single)', async () => {
        await expect(
            add({
                files: 'a-file.txt'
            })
        ).resolves.toEqual(true);
    });

    test('files (single), workingDirectory', async () => {
        await expect(
            add({
                files: 'a-file.txt',
                workingDirectory: '/tmp/repository'
            })
        ).resolves.toEqual(true);
    });

    test('files (multiple)', async () => {
        await expect(
            add({
                files: ['a-file.txt', 'another-file.txt']
            })
        ).resolves.toEqual(true);
    });

    test('files (multiple), workingDirectory', async () => {
        await expect(
            add({
                files: ['a-file.txt', 'another-file.txt'],
                workingDirectory: '/tmp/repository'
            })
        ).resolves.toEqual(true);
    });

});

describe('`add` method throws `InvalidOptions` error when given invalid options', () => {

    test('<no options object>', async () => {
        await expect(
            add()
        ).rejects.toThrowError('InvalidOptions');
    });

    test('<empty options object>', async () => {
        await expect(
            add({})
        ).rejects.toThrowError('InvalidOptions');
    });

    test('files (undefined)', async () => {
        await expect(
            add({
                files: undefined,
            })
        ).rejects.toThrowError('InvalidOptions');
    });

    test('files (empty string)', async () => {
        await expect(
            add({
                files: '',
            })
        ).rejects.toThrowError('InvalidOptions');
    });

    test('files (empty array)', async () => {
        await expect(
            add({
                files: [],
            })
        ).rejects.toThrowError('InvalidOptions');
    });

    test('files (string), workingDirectory (number)', async () => {
        await expect(
            add({
                files: 'a-file.txt',
                workingDirectory: 1234
            })
        ).rejects.toThrowError('InvalidOptions');
    });

});

describe('`add` method throws `GitCommandError` error when the command run by dugite fails', () => {

    beforeAll(() => {
        GitProcess.exec.mockResolvedValue({
            stdout: "",
            stderr: "fatal: pathspec 'missing-file.txt' did not match any files",
            exitCode: 1,
        });
    });

    test('valid options, error from git CLI', async () => {
        await expect(
            add({
                files: 'missing-file.txt',
                workingDirectory: '/tmp/repository',
            })
        ).rejects.toThrowError('GitCommandError');
    });

});
