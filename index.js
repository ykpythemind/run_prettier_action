const core = require('@actions/core');
const github = require('@actions/github');

const { execSync } = require('child_process');

try {
  const command = core.getInput('prettier_command');
  console.log(`Hello ${command}!`);

  console.log(execSync('ls -la'))

  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
