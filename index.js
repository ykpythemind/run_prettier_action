const core = require('@actions/core');
const github = require('@actions/github');

const { execSync } = require('child_process');

try {
  const command = core.getInput('prettier_command');

  // console.log('basebranch')
  // console.log(baseBranch)
  //
  // if (baseBranch) {
  //   console.log(execSync(`git fetch ${baseBranch} --depth 1`).toString())
  // }

  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);

  const prettierCommand = `${command}`

  console.log(`${prettierCommand}`)
  console.log(execSync(prettierCommand).toString())

} catch (error) {
  core.setFailed(error.message);
}
