const fs = require('fs');

const { add } = require('../src');

async function main() {
    try {
        const workingDirectory = '/tmp/repository';
        const filepath = '.gitignore';

        fs.writeFileSync(`${workingDirectory}/${filepath}`, 'node_modules\n');

        await add({
            files: filepath,
            workingDirectory
        });

        const files = ['file1.txt', 'file2.txt', 'file3.txt'];
        files.forEach((filepath) => {
            fs.writeFileSync(`${workingDirectory}/${filepath}`, `This is ${filepath}\n`);
        });

        await add({
            files,
            workingDirectory
        });
    } catch (err) {
        console.error(err.message);
    }
}

main();
