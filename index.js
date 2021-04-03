const core = require('@actions/core');
const github = require('@actions/github');
const { Octokit } = require("@octokit/action");

const { execSync, spawnSync } = require('child_process');

(async () => {
  try {
    const prettierCommand = core.getInput('prettier_command');

    const pullRequestNumber = github.context.payload.issue.number;
    const commentBody = github.context.payload.comment.body;

    if (!commentBody || !commentBody.trim().startsWith('/prettier')) {
      console.log('skip.')
      return
    }

    const octokit = new Octokit();
    // const { data } = await octokit.pulls.get({
    //    owner: github.context.repo.owner,
    //    repo: github.context.repo.repo,
    //    pull_number: pullRequestNumber,
    // });

    // const baseBranch = data.base.ref

    // todo: paginate
    const { data: fileList } = await octokit.pulls.listFiles({
       owner: github.context.repo.owner,
       repo: github.context.repo.repo,
       pull_number: pullRequestNumber,
    });

    const files = fileList.map(s => s.filename)
    console.log(files)

    // console.log(execSync(`git fetch ${baseBranch} --depth 1`).toString())

    // const payload = JSON.stringify(github.context.payload, undefined, 2)
    // console.log(`The event payload: ${payload}`);

    const command = `${prettierCommand} ${files.join(' ')}`
    console.log(command)

    const { status, error, stdout } = spawnSync(command)

    if (status !== 0 || status !== 1) {
      if (error) {
        throw error
      }
    }

    const cmdOutput = stdout.toString()
    console.log(cmdOutput)

  } catch (error) {
    core.setFailed(error.message);
  }
})();
