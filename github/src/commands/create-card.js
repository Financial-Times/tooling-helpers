const { createPullRequestCard } = require('../index');

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

const main = async ({ column, pullRequest }) => {
    await createPullRequestCard({
        column_id: column,
        content_id: pullRequest,
        content_type: 'PullRequest'
    });
};

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


