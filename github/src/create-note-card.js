module.exports = (octokit) => {

  return async ({ column_id, note }) => {
    /**
     * Create a GitHub project card
     *
     * @see https://octokit.github.io/rest.js/#api-Projects-createCard
     */
    const result = await octokit.projects.createCard({ column_id, note });

    return result.data;
  };
};
