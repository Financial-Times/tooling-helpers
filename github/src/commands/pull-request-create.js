const { createPullRequest } = require('../index');
const fs = require('fs');

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
			demandOption: false,
			type: 'string',
		});
};

const handler = async ({ owner, repo, title, branch, base, body }) => {

	const pullRequestBody = fs.readFileSync(body, 'utf8');

	const pullRequest = await createPullRequest({
		owner,
		repo,
		title,
		head: branch,
		base,
		body: pullRequestBody
	});

	console.log(pullRequest.id);
};

module.exports = {
	command: 'pull-request:create',
	desc: 'Create a new pull request',
	builder,
	handler,
};


