module.exports.createPullRequest = async (octokit, { owner, repo, title, head, base }) => {
	const result = await octokit.pulls.create({ owner, repo, title, head, base });

	return result;
};
