const { GitProcess } = require('dugite');

const { commit } = require('../src');

const commitMessage = `Title of the commit

This is the description. It explains the "why" of the code
in this commit.
`;

afterEach(() => {
    jest.clearAllMocks();
});

describe('`commit` method returns boolean true when given valid options', () => {

    beforeAll(() => {
        GitProcess.exec.mockResolvedValue({
            stdout: "[new-feature-branch 197dc738] Title of the commit\n 4 files changed, 4 deletions(-)\n delete mode 100644 .gitignore\n delete mode 100644 file1.txt\n delete mode 100644 file2.txt\n delete mode 100644 file3.txt\n",
            stderr: "",
            exitCode: 0,
        });
    });

    test('message', async () => {
        await expect(
            commit({
                message: commitMessage
            })
        ).resolves.toEqual(true);
    });

    test('message, workingDirectory', async () => {
        await expect(
            commit({
                message: commitMessage,
                workingDirectory: '/tmp/repository'
            })
        ).resolves.toEqual(true);
    });

});

describe('`commit` method throws `InvalidOptions` error when given invalid options', () => {

    test('<no options object>', async () => {
        await expect(
            commit()
        ).rejects.toThrowError('InvalidOptions');
    });

    test('<empty options object>', async () => {
        await expect(
            commit({})
        ).rejects.toThrowError('InvalidOptions');
    });

    test('message (empty string)', async () => {
        await expect(
            commit({
                message: '',
            })
        ).rejects.toThrowError('InvalidOptions');
    });

    test('message (string), workingDirectory (number)', async () => {
        await expect(
            commit({
                message: commitMessage,
                workingDirectory: 1234
            })
        ).rejects.toThrowError('InvalidOptions');
    });

});

describe('`commit` method throws `GitCommandError` error when the command run by dugite fails', () => {

    beforeAll(() => {
        GitProcess.exec.mockResolvedValue({
            stdout: "On branch new-feature-branch\nnothing to commit, working tree clean\n",
            stderr: "",
            exitCode: 1,
        });
    });

    test('valid options, error from git CLI', async () => {
        await expect(
            commit({
                message: commitMessage,
                workingDirectory: '/tmp/repository',
            })
        ).rejects.toThrowError('GitCommandError');
    });

});
