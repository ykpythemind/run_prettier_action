# run_prettier_action

## Usage

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
          token: ${{ secrets.PRIVATE_ACCESS_TOKEN }}

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

<img width="1061" alt="image" src="https://user-images.githubusercontent.com/22209702/115342382-25e0bc00-a1e5-11eb-8683-e8b5662a8c41.png">


### About (Japanese)

インストールすると、PRコメントで `/prettier` を入力することで自動でprettierをかけ、commitを積んでくれるactionが起動します。
pre commit hookが苦手な方、任意のタイミングでprettierかけたい方にオススメです

## option

## prerequisite

Your repository must contain `prettier` package on package.json

## build actions

```
npm run ncc
```
