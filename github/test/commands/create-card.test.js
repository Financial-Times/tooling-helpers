const yargs = require('yargs');

const columnFixture = require('../../../__mocks__/@octokit/fixtures/createColumn');

const pullRequestFixture = require('../../../__mocks__/@octokit/fixtures/createCard');

const addPullRequestCommand = require('../../src/commands/create-card');

jest.spyOn(global.console, 'warn')
    .mockImplementation((message) => message);

jest.spyOn(global.console, 'error')
    .mockImplementation((message) => message);

afterEach(() => {
    jest.clearAllMocks();
});

test('`project:add-pull-request` command module exports an object that can be used by yargs', () => {
    expect.objectContaining({
        command: expect.stringMatching('project:add-pull-request'),
        desc: expect.any(String),
        builder: expect.any(Function),
        handler: expect.any(Function)
    });
});

test('yargs can load the `project:add-pull-request` command without any errors or warnings', () => {
    expect(() => {
        yargs.command(
            addPullRequestCommand.command,
            addPullRequestCommand.desc,
            addPullRequestCommand.builder,
            addPullRequestCommand.handler
        ).argv
    }).not.toThrow();

    expect(console.warn).not.toBeCalled();
});

// test('running command handler without `column` will exit process with error', async () => {
//     await addPullRequestCommand.handler({
//         column: columnFixture.id
//     });
//     expect(console.error).toHaveBeenCalled();
// });

// test('running command handler without `pull-request` will exit process with error', async () => {
//   await addPullRequestCommand.handler({
//     pullRequest: pullRequestFixture.id
//   });
//   expect(console.error).toHaveBeenCalled();
// });

test('running command handler with valid options will not exit process with error', async () => {
  await addPullRequestCommand.handler({
    column: columnFixture.id,
    pullRequest: pullRequestFixture.id
  });
  expect(console.error).not.toHaveBeenCalled();
});

