const { createProject } = require('../index');

const builder = (yargs) => {

	return yargs
		.option('org', {
			alias: 'o',
			describe: 'Organization',
			demandOption: true,
			type: 'string',
		})
		.option('name', {
			alias: 'n',
			describe: 'Project name',
			demandOption: true,
			type: 'string',
		});
};

const handler = async ({ org, name }) => {
	console.log(org);
	console.log(name);
	const project = await createProject({ org, name });
	console.log(`Your project has been created: ${project.html_url}`);
};

module.exports = {
	command: 'project:create',
	desc: 'Create a new project',
	builder,
	handler,
};

