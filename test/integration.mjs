import { Octokit } from "@octokit/rest";
import { mkdtemp } from "fs";
import path from "path";
import os from "os";
import { execSync } from "child_process";

import { randomBytes } from "crypto";

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567".split("");

async function sleep(s) {
  return new Promise((r) => setTimeout(r, s * 1000));
}

function generateRandomString(length) {
  return randomBytes(length).reduce((p, i) => p + chars[i % 32], "");
}

function withErrorHandling(func) {
  try {
    func();
  } catch (e) {
    console.error(e);
  }
}

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const remoteBranchName = process.env.REMOTE_BRANCH;
if (!remoteBranchName) {
  throw Error("specify REMOTE_BRANCH");
}

const branchName = generateRandomString(32);

(async () => {
  mkdtemp(path.join(os.tmpdir(), "foo-"), async (err, directory) => {
    if (err) throw err;

    process.chdir(directory);

    const stdout = execSync(
      "git clone https://github.com/ykpythemind/run_prettier_action ."
    );

    execSync(`git checkout -b ${branchName} origin/${remoteBranchName}`);

    execSync(`echo 'const a    = "fuga"' > dummy.js`);
    console.log(execSync("ls -la").toString());

    execSync(`git add .`);
    execSync(`git commit -m 'test'`);

    let pr = null;
    const owner = "ykpythemind";
    const repo = "run_prettier_action";

    try {
      execSync(`git push origin -u ${branchName}`);

      const resp = await octokit.pulls.create({
        owner,
        repo,
        head: branchName,
        base: "main",
        title: `[test] ${branchName}`,
      });

      console.log(resp);
      pr = resp.data.number;

      const commits = await octokit.pulls.listCommits({
        owner,
        repo,
        pull_number: pr,
      });
      console.log(commits);
      const commitsnum = commits.data.length;

      const comment = await octokit.issues.createComment({
        owner,
        repo,
        issue_number: pr,
        body: "/p",
      });

      console.log("sleep...");
      await sleep(20);

      for (let item of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
        const commits = await octokit.pulls.listCommits({
          owner,
          repo,
          pull_number: pr,
        });
        console.log(commits);
        const newCommitNum = commits.data.length;

        console.log(`c ${commitsnum}: c2: ${newCommitNum}`);
        await sleep(1);
      }
    } catch (e) {
      console.error(e);
    } finally {
      if (pr) {
        withErrorHandling(async () => {
          // if pr, close...
          await octokit.pulls.update({
            owner,
            repo,
            pull_number: pr,
            state: "closed",
          });
          console.log("[cleanup] closed pull request");
        });
      }
    }
  });
})();
