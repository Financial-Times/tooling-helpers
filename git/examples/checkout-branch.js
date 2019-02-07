const { checkoutBranch } = require('../src');

async function main() {
    try {
        await checkoutBranch({
            name: 'feature-branch',
            workingDirectory: '/tmp/repository'
        });
    } catch (err) {
        console.error(err.message);
    }
}

main();
