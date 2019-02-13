const { GitProcess } = require('dugite');

const { push } = require('../src');

afterEach(() => {
    jest.clearAllMocks();
});

describe('`push` method returns boolean true when given valid options', () => {

    beforeAll(() => {
        GitProcess.exec.mockResolvedValue({
            stdout: "",
            stderr: "remote: \nremote: \nTo github.com:org/repository.git\n * [new branch]        new-feature-branch -> new-feature-branch\n",
            exitCode: 0,
        });
    });

    test('<no options object>', async () => {
        await expect(
            push()
        ).resolves.toEqual(true);
    });

    test('<empty options object>', async () => {
        await expect(
            push({})
        ).resolves.toEqual(true);
    });

    test('repository', async () => {
        await expect(
            push({
                repository: 'origin'
            })
        ).resolves.toEqual(true);
    });

    test('repository, refspec', async () => {
        await expect(
            push({
                repository: 'origin',
                refspec: 'new-feature-branch'
            })
        ).resolves.toEqual(true);
    });

    test('repository, refspec, workingDirectory', async () => {
        await expect(
            push({
                repository: 'origin',
                refspec: 'new-feature-branch',
                workingDirectory: '/tmp/repository'
            })
        ).resolves.toEqual(true);
    });

});

describe('`push` method throws `InvalidOptions` error when given invalid options', () => {

    test('repository (number)', async () => {
        await expect(
            push({
                repository: 1234,
            })
        ).rejects.toThrowError('InvalidOptions');
    });

    test('repository (string), refspec (number)', async () => {
        await expect(
            push({
                repository: 'origin',
                refspec: 1234,
            })
        ).rejects.toThrowError('InvalidOptions');
    });

    test('repository (string), refspec (string), workingDirectory (number)', async () => {
        await expect(
            push({
                repository: 'origin',
                refspec: 'new-feaure-branch',
                workingDirectory: 1234
            })
        ).rejects.toThrowError('InvalidOptions');
    });

});

describe('`push` method throws `GitCommandError` error when the command run by dugite fails', () => {

    beforeAll(() => {
        GitProcess.exec.mockResolvedValue({
            stdout: "",
            stderr: "error: src refspec branch-that-does-not-exist does not match any.\nerror: failed to push some refs to 'git@github.com:org/repository.git'\n",
            exitCode: 1,
        });
    });

    test('valid options, error from git CLI', async () => {
        await expect(
            push({
                repository: 'origin',
                refspec: 'branch-that-does-not-exist',
            })
        ).rejects.toThrowError('GitCommandError');
    });

});
