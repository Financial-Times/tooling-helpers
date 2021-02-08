const { getCentralBranch } = require('../src');

async function main() {
    try {
        await getCentralBranch({
            remoteUrl: 'git@github.com:org/repository.git',
        });
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err.message);
    }
}

main();
