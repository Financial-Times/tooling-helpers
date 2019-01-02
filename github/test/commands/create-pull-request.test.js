const yargs = require('yargs');

const createPullRequestCommand = require('../../src/commands/create-pull-request');

jest.spyOn(global.console, 'warn')
    .mockImplementation((message) => message);

jest.spyOn(global.console, 'error')
    .mockImplementation((message) => message);

test('`pull-request:create` command module exports an object that can be used by yargs', () => {
    expect.objectContaining({
        command: expect.stringMatching('project:create'),
        desc: expect.any(String),
        builder: expect.any(Function),
        handler: expect.any(Function)
    });
});

test('yargs can load the `pull-request:create` command without any errors or warnings', () => {
    expect(() => {
        yargs.command(
            createPullRequestCommand.command,
            createPullRequestCommand.desc,
            createPullRequestCommand.builder,
            createPullRequestCommand.handler
        ).argv
    }).not.toThrow();

    expect(console.warn).not.toBeCalled();
});
