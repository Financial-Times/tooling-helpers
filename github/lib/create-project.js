module.exports.createProject = async (octokit, {org, name}) => {
	const result = await octokit.projects.createForOrg({
		org: org,
		name: name
	});

	return result;
};
