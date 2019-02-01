module.exports = function constructDugiteExecArgs({
    command,
    options = {},
    positional = []
}) {
    const filteredOptions = [];
    const optionsKeys = Object.keys(options);
    for (let optionKey of optionsKeys) {
        const optionValue = options[optionKey];
        const optionIsNotEmpty = Boolean(optionValue);
        if (optionIsNotEmpty) {
            filteredOptions.push(optionKey, optionValue);
        }
    }

    const filteredPositionalArgs = positional.filter(arg => arg);

    return [
        command,
        ...filteredOptions,
        ...filteredPositionalArgs
    ];
};
