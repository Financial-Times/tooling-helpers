const handleDugiteExecResult = require('../../src/helpers/handle-dugite-exec-result');

test('`handleDugiteExecResult` returns true when exitCode is 0', () => {

    const result = handleDugiteExecResult({
        dugiteExecResult: {
            stdout: "",
            stderr: "Cloning into '/tmp/repository'...\n",
            exitCode: 0
        },
        dugiteExecArgs: ['clone', 'git@github.com:org/repository.git', '/tmp/repository']
    });

    expect(result).toEqual(true);
});

describe('`handleDugiteExecResult` throws a `GitCommandError` error with context when exitCode is _not_ 0', () => {

    test('git error found in stderr', () => {
        expect(() => {
            handleDugiteExecResult({
                dugiteExecResult: {
                    stdout: "",
                    stderr: "fatal: Not a git repository (or any parent up to mount point /home/username)\nStopping at filesystem boundary (GIT_DISCOVERY_ACROSS_FILESYSTEM not set).",
                    exitCode: 1
                },
                dugiteExecArgs: ['status'],
                workingDirectory: '/tmp'
            });
        }).toThrowError(/GitCommandError:.+fatal: Not a git repository/s);
    });

    test('git error found in stdout', () => {
        expect(() => {
            handleDugiteExecResult({
                dugiteExecResult: {
                    stdout: "On branch new-feature-branch\nnothing to commit, working tree clean\n",
                    stderr: "",
                    exitCode: 1
                },
                dugiteExecArgs: ['commit'],
                workingDirectory: '/tmp/repository'
            });
        }).toThrowError(/GitCommandError:.+nothing to commit/s);
    });

});
