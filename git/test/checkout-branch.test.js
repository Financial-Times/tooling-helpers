const { GitProcess } = require('dugite');

const { checkoutBranch } = require('../src');

afterEach(() => {
    jest.clearAllMocks();
});

describe('`checkoutBranch` method returns boolean true when given valid options', () => {

    beforeAll(() => {
        GitProcess.exec.mockResolvedValue({
            stdout: "",
            stderr: "",
            exitCode: 0,
        });
    });

    test('name', async () => {
        await expect(
            checkoutBranch({
                name: 'feature-branch'
            })
        ).resolves.toEqual(true);
    });

    test('name, workingDirectory', async () => {
        await expect(
            checkoutBranch({
                name: 'feature-branch',
                workingDirectory: '/tmp/repository'
            })
        ).resolves.toEqual(true);
    });

});

describe('`checkoutBranch` method throws `InvalidOptions` error when given invalid options', () => {

    test('<no options object>', async () => {
        await expect(
            checkoutBranch()
        ).rejects.toThrowError('InvalidOptions');
    });

    test('<empty options object>', async () => {
        await expect(
            checkoutBranch({})
        ).rejects.toThrowError('InvalidOptions');
    });

    test('name (empty string)', async () => {
        await expect(
            checkoutBranch({
                name: '',
            })
        ).rejects.toThrowError('InvalidOptions');
    });

    test('name (string), workingDirectory (number)', async () => {
        await expect(
            checkoutBranch({
                name: 'feature-branch',
                workingDirectory: 1234
            })
        ).rejects.toThrowError('InvalidOptions');
    });

});

describe('`checkoutBranch` method throws `GitCommandError` error when the command run by dugite fails', () => {

    beforeAll(() => {
        GitProcess.exec.mockResolvedValue({
            stdout: "",
            stderr: "error: pathspec 'branch-that-does-not-exist' did not match any file(s) known to git",
            exitCode: 1,
        });
    });

    test('valid options, error from git CLI', async () => {
        await expect(
            checkoutBranch({
                name: 'branch-that-does-not-exist',
                workingDirectory: '/tmp/repository',
            })
        ).rejects.toThrowError('GitCommandError');
    });

});
