const { GitProcess } = require('dugite');

const { deleteBranch } = require('../src');

afterEach(() => {
    jest.clearAllMocks();
});

describe('`deleteBranch` method returns boolean true when given valid options', () => {

    beforeAll(() => {
        GitProcess.exec.mockResolvedValue({
            stdout: "",
            stderr: "",
            exitCode: 0,
        });
    });

    test('name', async () => {
        await expect(
            deleteBranch({
                branch: 'feature-branch'
            })
        ).resolves.toEqual(true);
    });

    test('name, workingDirectory', async () => {
        await expect(
            deleteBranch({
                branch: 'feature-branch',
                workingDirectory: '/tmp/repository'
            })
        ).resolves.toEqual(true);
    });

});

describe('`deleteBranch` method throws `InvalidOptions` error when given invalid options', () => {

    test('<no options object>', async () => {
        await expect(
            deleteBranch()
        ).rejects.toThrowError('InvalidOptions');
    });

    test('<empty options object>', async () => {
        await expect(
            deleteBranch({})
        ).rejects.toThrowError('InvalidOptions');
    });

    test('name (empty string)', async () => {
        await expect(
            deleteBranch({
                branch: '',
            })
        ).rejects.toThrowError('InvalidOptions');
    });

    test('name (string), workingDirectory (number)', async () => {
        await expect(
            deleteBranch({
                branch: 'feature-branch',
                workingDirectory: 1234
            })
        ).rejects.toThrowError('InvalidOptions');
    });

});

describe('`deleteBranch` method throws `GitCommandError` error when the command run by dugite fails', () => {

    beforeAll(() => {
        GitProcess.exec.mockResolvedValue({
            stdout: "",
            stderr: "error: pathspec 'branch-that-does-not-exist' did not match any file(s) known to git",
            exitCode: 1,
        });
    });

    test('valid options, error from git CLI', async () => {
        await expect(
            deleteBranch({
                branch: 'branch-that-does-not-exist',
                workingDirectory: '/tmp/repository',
            })
        ).rejects.toThrowError('GitCommandError');
    });

});
