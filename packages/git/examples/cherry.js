const { cherry } = require('../src');

async function main() {
    try {
        return await cherry({
            workingDirectory: '/tmp/repository',
            upstream: 'origin',
            head: 'feature-branch'
        })
    } catch (err) {
        console.error(err.message);
    }
}

main();
