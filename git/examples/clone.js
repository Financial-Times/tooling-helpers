const { clone } = require('../src');

async function main() {
    try {
        await clone({
            repository: 'git@github.com:org/repository.git',
            directory: '/tmp/repository',
            origin: 'heroku',
            branch: 'feature-branch'
        });
    } catch (err) {
        console.error(err.message);
    }
}

main();
