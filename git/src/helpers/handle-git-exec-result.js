module.exports = function handleGitExecResult({
    result,
    gitExecArgs,
    workingDirectory = null
}) {
    if (result.exitCode === 0) {
        return true;
    }

    const commandRun = ['git'];
    if (workingDirectory) {
        commandRun.push(`-C ${workingDirectory}`);
    }
    commandRun.push(...gitExecArgs);

    throw new Error(`Error running git command:\n\n${
        commandRun.join(' ')
    }\n\nError message from git:\n\n${
        result.stderr
    }`);
};
