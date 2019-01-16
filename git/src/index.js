const NodeGit = require("nodegit");

const generateRemoteCallbacks = (credentials) => {

  if (typeof credentials === 'undefined') {
    return {};
  }

  if (credentials.type !== Git.CREDENTIAL_TYPE_GITHUB_OAUTH) {
    throw new Error(`Git: Unsupported credentials type '${credentials.type}'`);
  }

  return {
    /**
     * Workaround for GitHub certificate issue in OS X.
     *
     * @see https://www.nodegit.org/guides/cloning/gh-two-factor/
     */
    certificateCheck: () => 1,
    credentials: () => {
      return NodeGit.Cred.userpassPlaintextNew(
        credentials.token,
        "x-oauth-basic"
      );
    }
  };
};

class Git {
  constructor({ credentials } = {}) {
    const remoteCallbacks = generateRemoteCallbacks(credentials);

    this.cloneOptions = { fetchOpts: { callbacks: remoteCallbacks } };
    this.pushOptions = { callbacks: remoteCallbacks };
  }

  /**
   * Clone a GitHub repository via HTTPS.
   *
   * @param {object} options
   * @param {string} options.repository - Remote URL for a repository
   * @param {string} options.directory - Local directory to clone repository to
   * @returns {import('nodegit').Repository}
   */
  async clone({ repository, directory }) {
    /**
     * @type import('nodegit').Repository
     */
    const repo = await NodeGit.Clone(repository, directory, this.cloneOptions).catch(
      err => {
        throw err;
      }
    );

    return new GitRepo({ repo, pushOptions: this.pushOptions });
  }

  /**
   * Open a local git repository.
   *
   * @param {string} directoryPath - Path to directory containing git repository
   * @returns {import('nodegit').Repository}
   */
  async open(directoryPath) {
    const repo = await NodeGit.Repository.open(directoryPath);

    return new GitRepo({ repo, pushOptions: this.pushOptions });
  }
}

Git.CREDENTIAL_TYPE_GITHUB_OAUTH = 1;

class GitRepo {
  /**
   * @param {import('nodegit').Repository} repo
   */
  constructor({ repo, pushOptions }) {
    this.repo = repo;
    this.workingDirectory = this.repo.workdir();
    this.index = null;
    this.pushOptions = pushOptions;
  }

  async createBranch({ branch }) {
    const fromBranch = "master";

    const mostRecentCommit = await this.repo.getBranchCommit(fromBranch);
    const mostRecentCommitId = mostRecentCommit.id();

    await this.repo.createBranch(branch, mostRecentCommitId);

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
    if (!this.index) {
      this.index = await this.repo.refreshIndex();
    }

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

    const headOId = await NodeGit.Reference.nameToId(this.repo, "HEAD");
    const parentCommit = await this.repo.getCommit(headOId);

    const gitConfig = await NodeGit.Config.openDefault();
    const gitUserEmail = (await gitConfig.getStringBuf("user.email")).toString();
    const gitUserName = (await gitConfig.getStringBuf("user.name")).toString();
    const author = NodeGit.Signature.now(gitUserName, gitUserEmail);
    const committer = NodeGit.Signature.now(gitUserName, gitUserEmail);

    const commitOId = await this.repo.createCommit(
      "HEAD",
      author,
      committer,
      message,
      treeOId,
      [parentCommit]
    );

    this.index = await this.repo.refreshIndex();

    return commitOId.tostrS();
  }

  async pushCurrentBranchToRemote({ remote = "origin" } = {}) {
    const headReference = await this.repo.head();
    const referenceName = headReference.name();

    await this.pushReferenceToRemote({ referenceName, remote });

    return true;
  }

  async pushReferenceToRemote({ referenceName, remote } = {}) {
    const remoteObject = await this.repo.getRemote(remote);
    const refSpec = `${referenceName}:${referenceName}`;

    await remoteObject.push([refSpec], this.pushOptions);

    return true;
  }
}

module.exports = Git;
