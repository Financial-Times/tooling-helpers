const fs = require('fs');

const { Git } = require('../src');

const repository = 'https://github.com/organization-name/repository-name';
const cloneDirectory = './tmp';
const branchName = 'test-branch';

const addFilepath = 'test-file';
const removeFilepath = 'README.md';

const commitMessage = 'This is a test commit title\n\nThis is a full description of the test commit.';

(async function main () {

    const git = new Git();

    // Clone a repository
    console.log(`Cloning repository: ${repository}`);
    const gitRepo = await git.clone({ repository, directory: cloneDirectory });

    // Create and checkout a branch
    console.log(`Creating and checking out branch: ${branchName}`);
    await gitRepo.createBranch({ branch: branchName });
    await gitRepo.checkoutBranch({ branch: branchName });

    // Add a file
    console.log(`Adding file: ${addFilepath}`);
    fs.writeFileSync(`${cloneDirectory}/${addFilepath}`, 'this is a test file');
    await gitRepo.addFile({ filepath: addFilepath });

    // Remove a file
    fs.unlinkSync(`${cloneDirectory}/${removeFilepath}`);
    console.log(`Removing file: ${removeFilepath}`);
    await gitRepo.removeFile({ filepath: removeFilepath });

    // Commit changes
    console.log('Creating commit');
    const commitId = await gitRepo.createCommit({ message: commitMessage });

    console.log(`Commit ID: ${commitId}`);

    // Push current branch to remote origin
    await gitRepo.pushCurrentBranchToRemote();

    console.log('Pushing to remote');

})();
