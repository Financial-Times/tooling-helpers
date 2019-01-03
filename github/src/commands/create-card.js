const { createPullRequestCard } = require('../index');

/**
 * yargs builder function.
 *
 * @param {import('yargs').Yargs} yargs - Instance of yargs
 */
const builder = (yargs) => {
    return yargs
        .option('column', {
            describe: 'Project column ID',
            demandOption: true,
            type: 'integer',
        })
        .option('pull-request', {
            describe: 'Pull request ID',
            demandOption: true,
            type: 'integer',
        });
};

/**
 * Add a pull request to an organisation's project.
 *
 * @param {object} argv - argv parsed and filtered by yargs
 * @param {number} argv.column
 * @param {number} argv.pullRequest
 */
const main = async ({ column, pullRequest }) => {
    await createPullRequestCard({
        column_id: column,
        content_id: pullRequest,
        content_type: 'PullRequest'
    });
};

/**
 * yargs handler function logic.
 *
 * @param {object} argv - argv parsed and filtered by yargs
 */
const handler = async (argv) => {
    try {
        await main(argv)
    } catch (error) {
        console.error(error);
    }
};

module.exports = {
    command: 'project:add-pull-request',
    desc: 'Add a pull request to a project',
    builder,
    handler,
};
