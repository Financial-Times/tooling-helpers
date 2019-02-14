const { createBranch } = require('../src');

async function main() {
    try {
        await createBranch({
            name: 'new-feature-branch',
            workingDirectory: '/tmp/repository'
        });
    } catch (err) {
        console.error(err.message);
    }
}

main();
