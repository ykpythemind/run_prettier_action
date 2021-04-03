const core = require('@actions/core');
const github = require('@actions/github');

const { execSync } = require('child_process');

try {
  const command = core.getInput('prettier_command');
  const targetFiles = core.getInput('target_files')

  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);

  const prettierCommand = `${targetFiles} | xargs ${command}`

  console.log(`${prettierCommand}`)
  console.log(execSync(prettierCommand).toString())

} catch (error) {
  core.setFailed(error.message);
}
