const { createProject, createProjectColumn } = require('../index');

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

const main = async ({ org, name }) => {
    const project = await createProject({ org, name });

    const toDoColumn = await createProjectColumn({
        project_id: project.id,
        name: 'To do'
    });

    const inProgressColumn = await createProjectColumn({
        project_id: project.id,
        name: 'In progress'
    });

    const doneColumn = await createProjectColumn({
        project_id: project.id,
        name: 'Done'
    });

    const details = {
        project: project.id,
        columns: {
            todo: toDoColumn.id,
            doing: inProgressColumn.id,
            done: doneColumn.id
        }
    };

    const json = JSON.stringify(details);

    console.log(json);
};

const handler = async (argv) => {
    try {
        await main(argv);

    } catch (error) {
        console.error(error);
    }
};

module.exports = {
    command: 'project:create',
    desc: 'Create a new project',
    builder,
    handler,
};

