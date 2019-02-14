const { commit } = require('../src');

const message = `Title of the commit

This is the description. It explains the "why" of the code
in this commit.
`;

async function main() {
    try {
        await commit({
            message,
            workingDirectory: '/tmp/repository'
        });
    } catch (err) {
        console.error(err.message);
    }
}

main();
