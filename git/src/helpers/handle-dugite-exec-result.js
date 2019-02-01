module.exports = function handleDugiteExecResult({
    dugiteExecResult,
    dugiteExecArgs,
    workingDirectory = null
}) {
    if (dugiteExecResult.exitCode === 0) {
        return true;
    }

    const commandRun = ['git'];
    if (workingDirectory) {
        commandRun.push(`-C ${workingDirectory}`);
    }
    commandRun.push(...dugiteExecArgs);

    throw new Error(`GitCommandError: Error running git command:\n\n${
        commandRun.join(' ')
    }\n\nError message from git:\n\n${
        dugiteExecResult.stderr
    }`);
};
