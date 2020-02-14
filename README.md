# Jira Extract Issue Keys

This Github Action parses all the possible issue keys from the commit message.

## Requirements

Issue keys must use capital letters and must have a dash ('-') between the letters and digits. There should be no spaces between the characters of an issue key.

Example: `EXAMPLE-123 Th1s 1s a commit-1` the only issue key is EXAMPLE-123

## Action Specifications

### Input values

#### Required

Inside your .yml file there should be something that looks like these required variables:

###### Environment variables

```
env:
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

For more information on Github Environment Variables, see https://help.github.com/en/actions/configuring-and-managing-workflows/using-environment-variables#default-environment-variables

###### Job specific variables

```
uses: HighwayThree/jira-extract-issue-keys@master
      with:
        is-pull-request: ${{ github.event_name == 'pull_request' }}
        parse-all-commits: ${{ github.event_name == 'push' }}
```

- `is-pull-request` - is true if the GitHub event is a pull request
- `parse-all-commits` - is true if the GitHub event is a push

### Output value

- `jira-keys` - All of the keys found in the commit. 
    - If is-pull-request was true, then it has all of the keys from all of the commits that were found in the pull request.

## Usage

An example of a pipeline using this actino can be found at: 
> https://github.com/HighwayThree/jira-github-action-integration-demo/blob/master/.github/workflows/ci.yml