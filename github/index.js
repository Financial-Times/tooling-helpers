const createProject = require('./lib/create-project');
const createProjectColumn = require('./lib/create-project-column');
const createProjectCard = require('./lib/create-project-card');

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

(async () => {
	// Create the project which returns an object with a project ID

	const project = await createProject.createProject(octokit, {
		org: 'financial-times-sandbox',
		name: 'Sample Project'
	});

	const projectId = project.data.id;

	// Create 'To do', 'In progress' and 'Done' columns which return an object with a column IDs

	const toDoColumn = await createProjectColumn.createProjectColumn(octokit, {
		project_id: projectId,
		name: 'To do'
	});

	const toDoColumnId = toDoColumn.data.id;

	const inProgressColumn = await createProjectColumn.createProjectColumn(octokit, {
		project_id: projectId,
		name: 'In progress'
	});

	const inProgressColumnId = inProgressColumn.data.id;

	const doneColumn = await createProjectColumn.createProjectColumn(octokit, {
		project_id: projectId,
		name: 'Done'
	});

	const doneColumnId = doneColumn.data.id;

	// Create a card with a note which returns an object with a card ID

	const card = await createProjectCard.createProjectCard(octokit, {
		column_id: toDoColumnId,
		note: 'Sample note'
	});

	const cardId = card.data.id;

})();
