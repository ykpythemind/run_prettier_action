const core = require('@actions/core');
const github = require('@actions/github');
const { Octokit } = require("@octokit/action");

const { execSync } = require('child_process');

(async () => {
  try {
    const command = core.getInput('prettier_command');

    // console.log('basebranch')
    // console.log(baseBranch)
    //
    // if (baseBranch) {
    //   console.log(execSync(`git fetch ${baseBranch} --depth 1`).toString())
    // }

    const pullRequestNumber = github.context.payload.issue.number;

    const { data } = await Octokit.pulls.get({
       owner: github.context.repo.owner,
       repo: github.context.repo.repo,
       pull_number: pullRequestNumber,
    });

    console.log(data)

    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`);

    const prettierCommand = `${command}`

    console.log(`${prettierCommand}`)
    console.log(execSync(prettierCommand).toString())

  } catch (error) {
    core.setFailed(error.message);
  }
})();
