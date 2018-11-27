const NodeGit = require("nodegit");

const cloneOptions = {
  fetchOpts: {
    callbacks: {
      /**
       * Workaround for GitHub certificate issue in OS X
       *
       * @see https://www.nodegit.org/guides/cloning/gh-two-factor/
       */
      certificateCheck: () => {
        return 1;
      },
      credentials: () => {
        if (!process.env.GITHUB_TOKEN) {
          throw new Error(
            "Missing environment variable GITHUB_TOKEN - please set this!"
          );
        }
        return NodeGit.Cred.userpassPlaintextNew(
          process.env.GITHUB_TOKEN,
          "x-oauth-basic"
        );
      }
    }
  }
};

class Git {
  constructor() {}

  /**
   * Clone a GitHub repository via HTTPS
   *
   * @param {string} fullRepoName
   * @returns {import('nodegit').Repository}
   */
  async clone({ repository, directory }) {
    /**
     * @type import('nodegit').Repository
     */
    const repo = await NodeGit.Clone(repository, directory, cloneOptions).catch(
      err => {
        throw err;
      }
    );

    return new GitRepo(repo);
  }
}

class GitRepo {
  constructor(repo) {
    this.repo = repo;
    this.workingDirectory = this.repo.workdir();
  }

  async checkout({ branch = false } = {}) {
    const fromBranch = "master";

    if (typeof branch === "string") {
      const mostRecentCommitId = (await this.repo.getBranchCommit(
        fromBranch
      )).id();
      await this.repo.createBranch(branch, mostRecentCommitId);
    }

    await this.repo.checkoutBranch(branch);

    const currentBranch = (await this.repo.getCurrentBranch()).name();
    console.log({ currentBranch });
  }

  async add({ filepath }) {
    const repoIndex = await this.repo.refreshIndex();
    await repoIndex.addByPath(filepath);
    repoIndex.write();
  }

  async commit({ message }) {
    console.log(`GitRepo#commit: Not yet implemented`, { message });
  }
}

module.exports = {
  Git,
  GitRepo,
  NodeGit
};
