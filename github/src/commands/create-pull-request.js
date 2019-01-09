const { createPullRequest } = require('../index');
const fs = require('fs');

/**
 * yargs builder function.
 *
 * @param {import('yargs').Yargs} yargs - Instance of yargs
 */
const builder = (yargs) => {
    return yargs
        .option('owner', {
            alias: 'o',
            describe: 'Owner',
            demandOption: true,
            type: 'string',
        })
        .option('repo', {
            alias: 'r',
            describe: 'Repository',
            demandOption: true,
            type: 'string',
        })
        .option('title', {
            alias: 't',
            describe: 'Pull request title',
            demandOption: true,
            type: 'string',
        })
        .option('branch', {
            describe: 'Branch',
            demandOption: true,
            type: 'string',
        })
        .option('base', {
            describe: 'Base branch',
            default: 'master',
            type: 'string',
        })
        .option('body', {
            describe: 'Path to pull request body',
            type: 'string',
        });
};

/**
 * Return the contents of a pull request body and create a pull request.
 *
 * @param {object} argv - argv parsed and filtered by yargs
 * @param {string} argv.owner
 * @param {string} argv.repo
 * @param {string} argv.title
 * @param {string} argv.branch
 * @param {string} [argv.base]
 * @param {string} [argv.body]
 * @throws {Error} - Throws an error if `body` is invalid
 */
const handler = async ({ owner, repo, title, branch, base, body }) => {
    const filePathProvided = typeof body !== 'undefined';
    const incorrectFilePath = filePathProvided && !fs.existsSync(body);
    const correctFilePath = filePathProvided && fs.existsSync(body);

    if (!owner || !repo || !title || !branch) {
        throw new Error('Owner, repo, title and branch must be provided');
    }

    if (incorrectFilePath) {
        throw new Error(`File path ${body} not found`);
    }

    const pullRequestBody = correctFilePath ? fs.readFileSync(body, 'utf8') : undefined;

    const pullRequest = await createPullRequest({
        owner,
        repo,
        title,
        head: branch,
        base,
        body: pullRequestBody
    });

    console.log('Pull request ID: ', pullRequest.id);
};

module.exports = {
    command: 'pull-request:create',
    desc: 'Create a new pull request',
    builder,
    handler,
};