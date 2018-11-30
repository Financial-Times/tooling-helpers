require('dotenv').config();

const octokit = require('@octokit/rest')({
	headers: {
		Accept: 'application/vnd.github.inertia-preview+json'
	}
});

// Token (https://github.com/settings/tokens)
octokit.authenticate({
	type: 'token',
	token: process.env.GITHUB_KEY
});

const createProject = require('./create-project')(octokit);
const createProjectColumn = require('./create-project-column')(octokit);
const createNoteCard = require('./create-note-card')(octokit);
const createPullRequest = require('./create-pull-request')(octokit);
const createPullRequestCard = require('./create-pull-request-card')(octokit);

module.exports = {
	createProject,
	createProjectColumn,
	createNoteCard,
	createPullRequest,
	createPullRequestCard,
};
