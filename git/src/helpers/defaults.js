function defaults({ workingDirectory }) {
    defaults.workingDirectory = workingDirectory;
}

defaults.workingDirectory = process.cwd();

module.exports = defaults;
