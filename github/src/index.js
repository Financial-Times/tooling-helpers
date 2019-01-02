require('dotenv').config();

const Octokit = require('@octokit/rest');

const octokit = new Octokit({
    headers: {
        /**
         * Access Projects API using this Accept header while it is under preview
         *
         * @see https://developer.github.com/v3/projects
         */
        Accept: 'application/vnd.github.inertia-preview+json'
    }
});

/**
 * Authenicate GitHub API calls using GitHub personal access token
 *
 * @see https://github.com/octokit/rest.js#authentication
 */
octokit.authenticate({
    type: 'token',
    token: process.env.GITHUB_PERSONAL_ACCESS_TOKEN
});

const createProject = require('./create-project')(octokit);
const createProjectColumn = require('./create-project-column')(octokit);
const createNoteCard = require('./create-note-card')(octokit);
const createPullRequest = require('./create-pull-request')(octokit);
const createPullRequestCard = require('./create-pull-request-card')(octokit);

module.exports = {
    createProject,
    createProjectColumn,
    createPullRequest,
    createPullRequestCard,
};
