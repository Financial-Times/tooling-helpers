const { GitProcess } = require('dugite');

const { createBranch } = require('../src');

afterEach(() => {
    jest.clearAllMocks();
});

describe('`createBranch` method returns boolean true when given valid options', () => {

    beforeAll(() => {
        GitProcess.exec.mockResolvedValue({
            stdout: "",
            stderr: "",
            exitCode: 0,
        });
    });

    test('name', async () => {
        await expect(
            createBranch({
                name: 'new-feature-branch'
            })
        ).resolves.toEqual(true);
    });

    test('name, workingDirectory', async () => {
        await expect(
            createBranch({
                name: 'new-feature-branch',
                workingDirectory: '/tmp/repository'
            })
        ).resolves.toEqual(true);
    });

});

describe('`createBranch` method throws `InvalidOptions` error when given invalid options', () => {

    test('<no options object>', async () => {
        await expect(
            createBranch()
        ).rejects.toThrowError('InvalidOptions');
    });

    test('<empty options object>', async () => {
        await expect(
            createBranch({})
        ).rejects.toThrowError('InvalidOptions');
    });

    test('name (empty string)', async () => {
        await expect(
            createBranch({
                name: '',
            })
        ).rejects.toThrowError('InvalidOptions');
    });

    test('name (string), workingDirectory (number)', async () => {
        await expect(
            createBranch({
                name: 'new-feature-branch',
                workingDirectory: 1234
            })
        ).rejects.toThrowError('InvalidOptions');
    });

});

describe('`createBranch` method throws `GitCommandError` error when the command run by dugite fails', () => {

    beforeAll(() => {
        GitProcess.exec.mockResolvedValue({
            stdout: '',
            stderr: "fatal: A branch named 'branch-that-already-exists' already exists.",
            exitCode: 1,
        });
    });

    test('valid options, error from git CLI', async () => {
        await expect(
            createBranch({
                name: 'branch-that-already-exists',
                workingDirectory: '/tmp/repository',
            })
        ).rejects.toThrowError('GitCommandError');
    });

});
