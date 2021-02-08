const constructDugiteExecArgs = require('../../src/helpers/construct-dugite-exec-args');

describe('`constructDugiteExecArgs` returns the correct array for any combination of argument options', () => {

    test('command: "status"', () => {
        const dugiteExecArgs = constructDugiteExecArgs({
            command: 'status',
        });

        expect(dugiteExecArgs).toEqual([
            'status'
        ]);
    });

    test('command: "status"; options: --short=true', () => {
        const dugiteExecArgs = constructDugiteExecArgs({
            command: 'status',
            options: {
                '--short': true
            }
        });

        expect(dugiteExecArgs).toEqual([
            'status', '--short'
        ]);
    });

    test('command: "status"; options: --short=false', () => {
        const dugiteExecArgs = constructDugiteExecArgs({
            command: 'status',
            options: {
                '--short': false
            }
        });

        expect(dugiteExecArgs).toEqual([
            'status'
        ]);
    });

    test('command: "push"; positional: "", null', () => {
        const dugiteExecArgs = constructDugiteExecArgs({
            command: 'push',
            positional: ['', null]
        });

        expect(dugiteExecArgs).toEqual([
            'push'
        ]);
    });

    test('command: "push"; positional: "origin", ""', () => {
        const dugiteExecArgs = constructDugiteExecArgs({
            command: 'push',
            positional: ['origin', '']
        });

        expect(dugiteExecArgs).toEqual([
            'push', 'origin'
        ]);
    });

    test('command: "push"; positional: "origin", "main"', () => {
        const dugiteExecArgs = constructDugiteExecArgs({
            command: 'push',
            positional: ['origin', 'main']
        });

        expect(dugiteExecArgs).toEqual([
            'push', 'origin', 'main'
        ]);
    });

    test('command: "push"; options: --all="", --tags=false; positional: "", null', () => {
        const dugiteExecArgs = constructDugiteExecArgs({
            command: 'push',
            options: {
                '--all': '',
                '--tags': false
            },
            positional: ['', null]
        });

        expect(dugiteExecArgs).toEqual([
            'push'
        ]);
    });

    test('command: "clone"; options: --origin="", --branch=null; positional: "git@github.com:org/repository.git", "/tmp/repository"', () => {
        const dugiteExecArgs = constructDugiteExecArgs({
            command: 'clone',
            options: {
                '--origin': '',
                '--branch': null
            },
            positional: ['git@github.com:org/repository.git', '']
        });

        expect(dugiteExecArgs).toEqual([
            'clone', 'git@github.com:org/repository.git'
        ]);
    });

    test('command: "clone"; options: --origin="heroku", --branch=""; positional: "git@github.com:org/repository.git", "/tmp/repository"', () => {
        const dugiteExecArgs = constructDugiteExecArgs({
            command: 'clone',
            options: {
                '--origin': 'heroku',
                '--branch': ''
            },
            positional: ['git@github.com:org/repository.git', '/tmp/repository']
        });

        expect(dugiteExecArgs).toEqual([
            'clone', '--origin', 'heroku', 'git@github.com:org/repository.git', '/tmp/repository'
        ]);
    });

    test('command: "clone"; options: --origin="", --branch="feature-branch"; positional: "git@github.com:org/repository.git", "/tmp/repository"', () => {
        const dugiteExecArgs = constructDugiteExecArgs({
            command: 'clone',
            options: {
                '--origin': 'heroku',
                '--branch': 'feature-branch'
            },
            positional: ['git@github.com:org/repository.git', '/tmp/repository']
        });

        expect(dugiteExecArgs).toEqual([
            'clone', '--origin', 'heroku', '--branch', 'feature-branch', 'git@github.com:org/repository.git', '/tmp/repository'
        ]);
    });

});
