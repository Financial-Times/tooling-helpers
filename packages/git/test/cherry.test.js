const { GitProcess } = require('dugite');

const { cherry } = require('../src');

afterEach(() => {
    jest.clearAllMocks();
});

describe('`cherry` method returns an empty array when given valid options but no commits have been made', () => {

    beforeAll(() => {
        GitProcess.exec.mockResolvedValue({
            stdout: "",
            stderr: "",
            exitCode: 0,
        });
    });

    test('workingDirectory', async () => {
        await expect(
            cherry({
                upstream: 'origin'
            })
        ).resolves.toEqual([]);
    });

    test('workingDirectory, upstream', async () => {
        await expect(
            cherry({
                workingDirectory: '/tmp/repository',
                upstream: 'origin'
            })
        ).resolves.toEqual([]);
    });

    test('workingDirectory, upstream, head', async () => {
        await expect(
            cherry({
                workingDirectory: '/tmp/repository',
                upstream: 'origin',
                head: 'new-branch'
            })
        ).resolves.toEqual([]);
    });

});

describe('`cherry` method returns an array of strings when given valid options and commits have been made', () => {

    beforeAll(() => {
        GitProcess.exec.mockResolvedValue({
            stdout: "+ 7b79a0247085663de33b0c059d4a5f9c7dd604e4 initial commit",
            stderr: "",
            exitCode: 0,
        });
    });

    test('workingDirectory', async () => {
        await expect(
            cherry({
                upstream: 'origin'
            })
        ).resolves.toEqual(['+ 7b79a0247085663de33b0c059d4a5f9c7dd604e4 initial commit']);
    });

    test('workingDirectory, upstream', async () => {
        await expect(
            cherry({
                workingDirectory: '/tmp/repository',
                upstream: 'origin'
            })
        ).resolves.toEqual(['+ 7b79a0247085663de33b0c059d4a5f9c7dd604e4 initial commit']);
    });

    test('workingDirectory, upstream, head', async () => {
        await expect(
            cherry({
                workingDirectory: '/tmp/repository',
                upstream: 'origin',
                head: 'new-branch'
            })
        ).resolves.toEqual(['+ 7b79a0247085663de33b0c059d4a5f9c7dd604e4 initial commit']);
    });

});


describe('`cherry` method throws `InvalidOptions` error when given invalid options', () => {

    test('<no options object>', async () => {
        await expect(
            cherry()
        ).rejects.toThrowError('InvalidOptions');
    });

    test('<empty options object>', async () => {
        await expect(
            cherry({})
        ).rejects.toThrowError('InvalidOptions');
    });

    test('upstream (empty string)', async () => {
        await expect(
            cherry({
                upstream: '',
            })
        ).rejects.toThrowError('InvalidOptions');
    });

    test('upstream (string), workingDirectory (number)', async () => {
        await expect(
            cherry({
                workingDirectory: 1234,
                upstream: 'origin',
            })
        ).rejects.toThrowError('InvalidOptions');
    });

    test('upstream (string), workingDirectory (string), head (number)', async () => {
        await expect(
            cherry({
                workingDirectory: '/tmp/repository',
                upstream: 'origin',
                head: 1234
            })
        ).rejects.toThrowError('InvalidOptions');
    });

});

describe('`cherry` method throws `GitCommandError` error when upstream branch was not found', () => {

    beforeAll(() => {
        GitProcess.exec.mockResolvedValue({
            stdout: '',
            stderr: "fatal: unknown commit unknown-upstream",
            exitCode: 1,
        });
    });

    test('valid options, error from git CLI', async () => {
        await expect(
            cherry({
                upstream: 'unknown-upstream',
                workingDirectory: '/tmp/repository',
            })
        ).rejects.toThrowError('GitCommandError');
    });

});
