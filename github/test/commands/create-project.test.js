const yargs = require('yargs');

const organisationFixture = require('../../../__mocks__/@octokit/fixtures/createForOrg');

const createProjectCommand = require('../../src/commands/create-project');

jest.spyOn(global.console, 'warn')
    .mockImplementation((message) => message);

jest.spyOn(global.console, 'error')
    .mockImplementation((message) => message);

afterEach(() => {
    jest.resetAllMocks();
});

test('`project:create` command module exports an object that can be used by yargs', () => {
    expect.objectContaining({
        command: expect.stringMatching('project:create'),
        desc: expect.any(String),
        builder: expect.any(Function),
        handler: expect.any(Function)
    });
});

test('yargs can load the `project:create` command without any errors or warnings', () => {
    expect(() => {
        yargs.command(
            createProjectCommand.command,
            createProjectCommand.desc,
            createProjectCommand.builder,
            createProjectCommand.handler
        ).argv
    }).not.toThrow();

    expect(console.warn).not.toBeCalled();
});

// test('running command handler without `name` will exit process with error', async () => {
//     await createProjectCommand.handler({
//         org: organisationFixture.creator.login,
//     });
//     expect(console.error).toHaveBeenCalled();
// });

// test('running command handler without `org` will exit process with error', async () => {
//     await createProjectCommand.handler({
//         name: organisationFixture.name
//     });
//     expect(console.error).toHaveBeenCalled();
// });

test('running command handler with valid options will not exit process with error', async () => {
    await createProjectCommand.handler({
        org: organisationFixture.creator.login,
        name: organisationFixture.name
    });
    expect(console.error).not.toHaveBeenCalled();
});

