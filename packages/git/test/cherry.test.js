const { GitProcess } = require('dugite');

const { cherry } = require('../src');

afterEach(() => {
    jest.clearAllMocks();
});

describe('`cherry` method returns an array of strings when given valid options', () => {

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
