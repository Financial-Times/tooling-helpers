const { GitProcess } = require('dugite');

const { listBranches } = require('../src');

afterEach(() => {
    jest.clearAllMocks();
});

describe('`listBranches` method returns parsed command output when given valid options', () => {

    beforeAll(() => {
        GitProcess.exec.mockResolvedValue({
            stdout: `* main
  branch1
  branch2
`,
            stderr: "",
            exitCode: 0,
        });
    });

    test('no args', async () => {
        await expect(
            listBranches({})
        ).resolves.toEqual(['main', 'branch1', 'branch2']);
    });

    test('workingDirectory', async () => {
        await expect(
            listBranches({
                workingDirectory: '/tmp/repository'
            })
        ).resolves.toEqual(['main', 'branch1', 'branch2']);
    });

    test('remote', async () => {
        await expect(
            listBranches({
                remote: true
            })
        ).resolves.toEqual(['main', 'branch1', 'branch2']);
    });

});

describe('`listBranches` method throws `InvalidOptions` error when given invalid options', () => {

    test('remote (string)', async () => {
        await expect(
            listBranches({
                remote: 'true',
            })
        ).rejects.toThrowError('InvalidOptions');
    });

    test('remote (boolean), workingDirectory (number)', async () => {
        await expect(
            listBranches({
                remote: true,
                workingDirectory: 1234
            })
        ).rejects.toThrowError('InvalidOptions');
    });

});

describe('`listBranches` method throws `GitCommandError` error when the command run by dugite fails', () => {

    beforeAll(() => {
        GitProcess.exec.mockResolvedValue({
            stdout: "",
            stderr: "error: pathspec 'branch-that-does-not-exist' did not match any file(s) known to git",
            exitCode: 1,
        });
    });

    test('valid options, error from git CLI', async () => {
        await expect(
            listBranches({})
        ).rejects.toThrowError('GitCommandError');
    });

});
