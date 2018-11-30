module.exports = (octokit) => {

	return async ({ org, name }) => {
		const result = await octokit.projects.createForOrg({ org, name });

		return result.data;
	};
};
