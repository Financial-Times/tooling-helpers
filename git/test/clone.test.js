const { GitProcess } = require('dugite');

const { clone } = require('../src');

afterEach(() => {
    jest.clearAllMocks();
});

describe('`clone` method returns boolean true when given valid options', () => {

    beforeAll(() => {
        GitProcess.exec.mockResolvedValue({
            stdout: '',
            stderr: "Cloning into '/tmp/repository'...\n",
            exitCode: 0,
        });
    });

    test('repository', async () => {
        await expect(
            clone({
                repository: 'git@github.com:org/repository.git',
            })
        ).resolves.toEqual(true);
    });

    test('repository, directory', async () => {
        await expect(
            clone({
                repository: 'git@github.com:org/repository.git',
                directory: '/tmp/repository',
            })
        ).resolves.toEqual(true);
    });

    test('repository, directory, origin', async () => {
        await expect(
            clone({
                repository: 'git@github.com:org/repository.git',
                directory: '/tmp/repository',
                origin: 'heroku',
            })
        ).resolves.toEqual(true);
    });

    test('repository, directory, origin, branch', async () => {
        await expect(
            clone({
                repository: 'git@github.com:org/repository.git',
                directory: '/tmp/repository',
                origin: 'heroku',
                branch: 'my-feature-branch',
            })
        ).resolves.toEqual(true);
    });

});

describe('`clone` method throws `InvalidOptions` error when given invalid options', () => {

    test('<no options object>', async () => {
        await expect(
            clone()
        ).rejects.toThrowError('InvalidOptions');
    });

    test('<empty options object>', async () => {
        await expect(
            clone({})
        ).rejects.toThrowError('InvalidOptions');
    });

    test('repository (empty string)', async () => {
        await expect(
            clone({
                repository: '',
            })
        ).rejects.toThrowError('InvalidOptions');
    });

    test('repository (string), directory (empty string)', async () => {
        await expect(
            clone({
                repository: 'git@github.com:org/repository.git',
                directory: '',
            })
        ).rejects.toThrowError('InvalidOptions');
    });

    test('repository (string), directory (string), origin (number)', async () => {
        await expect(
            clone({
                repository: 'git@github.com:org/repository.git',
                directory: '/tmp/repository',
                origin: 1234,
            })
        ).rejects.toThrowError('InvalidOptions');
    });

    test('repository (string), directory (string), origin (string), branch (number)', async () => {
        await expect(
            clone({
                repository: 'git@github.com:org/repository.git',
                directory: '/tmp/repository',
                origin: 'heroku',
                branch: 1234,
            })
        ).rejects.toThrowError('InvalidOptions');
    });

});

describe('`clone` method throws `GitCommandError` error when the command run by dugite fails', () => {

    beforeAll(() => {
        GitProcess.exec.mockResolvedValue({
            stdout: '',
            stderr: "fatal: destination path '/tmp/repository-that-already-exists' already exists and is not an empty directory.",
            exitCode: 1,
        });
    });

    test('valid options, error from git CLI', async () => {
        await expect(
            clone({
                repository: 'git@github.com:org/repository.git',
                directory: '/tmp/repository-that-already-exists',
            })
        ).rejects.toThrowError('GitCommandError');
    });

});
