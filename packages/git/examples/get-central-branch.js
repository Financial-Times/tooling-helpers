const { getCentralBranch } = require('../src');

async function main() {
    try {
        await getCentralBranch({
            remoteUrl: 'git@github.com:Financial-Times/next-health.git',
        });
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err.message);
    }
}

main();
