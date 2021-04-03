const core = require('@actions/core');
const github = require('@actions/github');
const { Octokit } = require("@octokit/action");
const exec = require('@actions/exec');

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
    const { data } = await octokit.pulls.get({
       owner: github.context.repo.owner,
       repo: github.context.repo.repo,
       pull_number: pullRequestNumber,
    });

    // const baseBranch = data.base.ref
    const branch = data.head.ref

    await exec.exec(`git fetch origin ${branch}`)
    await exec.exec(`git switch ${branch}`)

    // todo: paginate
    const { data: fileList } = await octokit.pulls.listFiles({
       owner: github.context.repo.owner,
       repo: github.context.repo.repo,
       pull_number: pullRequestNumber,
    });

    const files = fileList.map(s => s.filename)
    console.log('target files:', files)

    // todo: inputs.glob

    const command = `${prettierCommand} ${files.join(' ')}`
    console.log('run command:', command)

    // actions/exec のほうが良いかも
    const { status, error, stdout } = spawnSync(command, { shell: true })

    if (status !== 0 || status !== 1) {
      if (error) {
        throw error
      }
    }

    const cmdOutput = stdout.toString()
    console.log(cmdOutput)

    // commit
    // await exec.exec(`gi`)

    // create PR comment
    const body = `prettier\n\n${cmdOutput}`

    await octokit.pulls.createReview({
       owner: github.context.repo.owner,
       repo: github.context.repo.repo,
       pull_number: pullRequestNumber,
       body: body,
       event: 'COMMENT'
    })
  } catch (error) {
    core.setFailed(error.message);
  }
})();
