module.exports.createProjectCard = async (octokit, {column_id, note}) => {
  const result = await octokit.projects.createCard({
    column_id: column_id,
    note: note
  });

  return result;
};
