const { push } = require('../src');

async function main() {
    try {
        await push({
            repository: 'origin',
            refspec: 'new-feature-branch',
            workingDirectory: '/tmp/repository'
        });
    } catch (err) {
        console.error(err.message);
    }
}

main();
