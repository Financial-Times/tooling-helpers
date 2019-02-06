const fs = require('fs');

const { rm } = require('../src');

async function main() {
    try {
        const workingDirectory = '/tmp/repository';

        const filepath = '.gitignore';

        await rm({
            files: filepath,
            workingDirectory
        });

        const files = ['file1.txt', 'file2.txt', 'file3.txt'];

        await rm({
            files,
            workingDirectory
        });
    } catch (err) {
        console.error(err.message);
    }
}

main();
