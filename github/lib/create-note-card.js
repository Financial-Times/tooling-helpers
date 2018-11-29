module.exports.createNoteCard = async (octokit, { column_id, note }) => {
  const result = await octokit.projects.createCard({ column_id, note });

  return result;
};
