module.exports.createProjectColumn = async (octokit, { project_id, name }) => {
  const result = await octokit.projects.createColumn({ project_id, name });

  return result;
};

