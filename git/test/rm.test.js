const { GitProcess } = require('dugite');

const { rm } = require('../src');

afterEach(() => {
    jest.clearAllMocks();
});

describe('`rm` method returns boolean true when given valid options', () => {

    const rmSingleFileResult = {
        stdout: "rm 'a-file.txt'\n",
        stderr: "",
        exitCode: 0,
    };

    const rmMultipleFilesResult = {
        stdout: "rm 'a-file.txt'\nrm 'another-file.txt'\n",
        stderr: "",
        exitCode: 0,
    };

    test('files (single)', async () => {
        GitProcess.exec.mockResolvedValue(rmSingleFileResult);

        await expect(
            rm({
                files: 'a-file.txt'
            })
        ).resolves.toEqual(true);
    });

    test('files (single), workingDirectory', async () => {
        GitProcess.exec.mockResolvedValue(rmSingleFileResult);

        await expect(
            rm({
                files: 'a-file.txt',
                workingDirectory: '/tmp/repository'
            })
        ).resolves.toEqual(true);
    });

    test('files (multiple)', async () => {
        GitProcess.exec.mockResolvedValue(rmMultipleFilesResult);

        await expect(
            rm({
                files: ['a-file.txt', 'another-file.txt']
            })
        ).resolves.toEqual(true);
    });

    test('files (multiple), workingDirectory', async () => {
        GitProcess.exec.mockResolvedValue(rmMultipleFilesResult);

        await expect(
            rm({
                files: ['a-file.txt', 'another-file.txt'],
                workingDirectory: '/tmp/repository'
            })
        ).resolves.toEqual(true);
    });

});

describe('`rm` method throws `InvalidOptions` error when given invalid options', () => {

    test('<no options object>', async () => {
        await expect(
            rm()
        ).rejects.toThrowError('InvalidOptions');
    });

    test('<empty options object>', async () => {
        await expect(
            rm({})
        ).rejects.toThrowError('InvalidOptions');
    });

    test('files (undefined)', async () => {
        await expect(
            rm({
                files: undefined,
            })
        ).rejects.toThrowError('InvalidOptions');
    });

    test('files (empty string)', async () => {
        await expect(
            rm({
                files: '',
            })
        ).rejects.toThrowError('InvalidOptions');
    });

    test('files (empty array)', async () => {
        await expect(
            rm({
                files: [],
            })
        ).rejects.toThrowError('InvalidOptions');
    });

    test('files (string), workingDirectory (number)', async () => {
        await expect(
            rm({
                files: 'a-file.txt',
                workingDirectory: 1234
            })
        ).rejects.toThrowError('InvalidOptions');
    });

});

describe('`rm` method throws `GitCommandError` error when the command run by dugite fails', () => {

    beforeAll(() => {
        GitProcess.exec.mockResolvedValue({
            stdout: "",
            stderr: "fatal: pathspec 'missing-file.txt' did not match any files",
            exitCode: 1,
        });
    });

    test('valid options, error from git CLI', async () => {
        await expect(
            rm({
                files: 'missing-file.txt',
                workingDirectory: '/tmp/repository',
            })
        ).rejects.toThrowError('GitCommandError');
    });

});
