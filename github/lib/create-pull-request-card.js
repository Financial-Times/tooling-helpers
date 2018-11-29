module.exports.createPullRequestCard = async (octokit, { column_id, content_id, content_type }) => {
	const result = await octokit.projects.createCard({ column_id, content_id, content_type });

	return result;
};
