module.exports = (octokit) => {

  return async ({ project_id, name }) => {
    const result = await octokit.projects.createColumn({ project_id, name });

    return result.data;
  };
};

