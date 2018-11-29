module.exports = (octokit) => {

	return async ({ owner, repo, title, head, base, body }) => {
		const result = await octokit.pulls.create({ owner, repo, title, head, base, body });

		return result.data;
	};
};
