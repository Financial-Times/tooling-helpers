/**
 * TODO:
 *
 * - Error handling in every method - https://www.nodegit.org/api/error/#CODE
 * - JSDoc comments
 */

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
    /**
     * @type import('nodegit').Repository
     */
    this.repo = repo;
    this.index = null;
    this.workingDirectory = this.repo.workdir();
  }

  async createBranch({ branch }) {

    const fromBranch = "master";

    const mostRecentCommit = await this.repo.getBranchCommit(fromBranch);
    const mostRecentCommitId = mostRecentCommit.id();

    await this.repo.createBranch(branch, mostRecentCommitId);

    // TODO: Review this
    this.index = await this.repo.refreshIndex();

    return true;
  }

  async checkoutBranch({ branch }) {
    await this.repo.checkoutBranch(branch);

    return true;
  }

  async createBranchAndCheckout({ branch }) {
    await this.createBranch({ branch });
    await this.checkoutBranch({ branch });

    return true;
  }

  async addFile({ filepath }) {
    await this.index.addByPath(filepath);
    await this.index.write();

    return true;
  }

  async removeFile({ filepath }) {
    await this.index.removeByPath(filepath);
    await this.index.write();

    return true;
  }

  async createCommit({ message }) {

    const treeOId = await this.index.writeTree();

    const headOId = await NodeGit.Reference.nameToId(this.repo, 'HEAD');
    const parentCommit = await this.repo.getCommit(headOId);

    // TODO: Review this
    const gitConfig = await NodeGit.Config.openDefault();
    const gitUserEmail = (await gitConfig.getStringBuf('user.email')).toString();
    const gitUserName = (await gitConfig.getStringBuf('user.name')).toString();
    const author = NodeGit.Signature.now(gitUserName, gitUserEmail);
    const committer = NodeGit.Signature.now(gitUserName, gitUserEmail);

    const commitId = await this.repo.createCommit('HEAD', author, committer, message, treeOId, [parentCommit]);

    // TODO: Review this
    this.index = await this.repo.refreshIndex();

    return commitId;
  }
}

module.exports = {
  Git,
  GitRepo,
  NodeGit
};
