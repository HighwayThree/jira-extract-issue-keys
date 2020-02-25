# Jira Extract Issue Keys

This Github Action parses all the possible issue keys from the commit message.

## Requirements

Issue keys must use capital letters and must have a dash ('-') between the letters and digits. There should be no spaces between the characters of an issue key.

Example: `EXAMPLE-123 TH-1S 1s a commit-1` the only issue key is EXAMPLE-123

## Action Specifications

### Input values

#### Required

Inside your .yml file there should be something that looks like this required variable:

###### Environment variables

```
env:
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

For more information on Github Environment Variables, see https://help.github.com/en/actions/configuring-and-managing-workflows/using-environment-variables#default-environment-variables

###### Optional variables

```
uses: HighwayThree/jira-extract-issue-keys@master
with:
    is-pull-request: ${{ github.event_name == 'pull_request' }}
    parse-all-commits: ${{ github.event_name == 'push' }}
    commit-message: 'EXAMPLE-1 message'
```

- `is-pull-request` - is true if the GitHub event is a pull request.
- `parse-all-commits` - is true if the GitHub event is a push.
- `commit-message` - commit message to be parsed for jira keys. If it is hardcoded like the example above, the smart commits do not send commit information to the hardcoded Jira issues. The default is the commit message, where the smart commits do send information to the issue keys found in the user's commit message.

### Output value

- `jira-keys` - All of the keys found in the commit. 
    - If is-pull-request was true, then it has all of the keys from all of the commits that were found in the pull request.

## Usage

An example of a pipeline using this actino can be found at: 
> https://github.com/HighwayThree/jira-github-action-integration-demo/blob/master/.github/workflows/ci.yml