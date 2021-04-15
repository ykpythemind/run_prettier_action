# run_prettier_action

```yaml
on:
  issue_comment:
    types: [created]

jobs:
  prettier_job:
    runs-on: ubuntu-latest
    name: prettier job
    steps:
      - name: Checkout
        uses: actions/checkout@v2
        with:
          # see https://github.com/stefanzweifel/git-auto-commit-action#commits-of-this-action-do-not-trigger-new-workflow-runs
          token: ${{ secrets.PAT }}

      - uses: actions/setup-node@v2
        with:
          node-version: "14"

      - run: npm install

      - name: run prettier command
        uses: ykpythemind/run_prettier_action@main
        with:
          prettier_command: ./node_modules/.bin/prettier --write
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - uses: stefanzweifel/git-auto-commit-action@v4
        with:
          commit_message: Apply prettier changes
          skip_fetch: true
```

## use

xxx

## option

## prerequisite

Your repository must contain `prettier` package on package.json

