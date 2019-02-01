module.exports = function constructCommandArgs({
    command,
    options = {},
    positional = []
}) {
    const optionsKeys = Object.keys(options);

    const filteredOptions = optionsKeys.reduce((filtered, option) => {
        if (options[option]) {
            filtered.push(option, options[option]);
        }
        return filtered;
    }, []);

    const filteredPositionalArgs = positional.filter(arg => arg);

    return [
        command,
        ...filteredOptions,
        ...filteredPositionalArgs
    ];
};
