module.exports.createProject = async (octokit, { org, name }) => {
	const result = await octokit.projects.createForOrg({ org, name });

	return result;
};
