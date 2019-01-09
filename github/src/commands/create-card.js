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
            type: 'number',
        })
        .option('pull-request', {
            describe: 'Pull request ID',
            demandOption: true,
            type: 'number',
        });
};

/**
 * Add a pull request to an organisation's project.
 *
 * @param {object} argv - argv parsed and filtered by yargs
 * @param {number} argv.column
 * @param {number} argv.pullRequest
 */
const handler = async ({ column, pullRequest }) => {

    if (isNaN(column) || isNaN(pullRequest)) {
        throw new Error('Column and pull request ID must be a number');
    }

    await createPullRequestCard({
        column_id: column,
        content_id: pullRequest,
        content_type: 'PullRequest'
    });
};

module.exports = {
    command: 'project:add-pull-request',
    desc: 'Add a pull request to a project',
    builder,
    handler
};
