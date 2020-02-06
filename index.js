const core = require('@actions/core');
const github = require('@actions/github');
const matchAll = require("match-all");
const Octokit = require("@octokit/rest");

async function extractJiraKeysFromCommit() {
    try {
        const regex = /([A-Z]+-\d+)/g;
        // console.log("core.getInput('is-pull-request'): " + core.getInput('is-pull-request'));
        const isPullRequest = core.getInput('is-pull-request') == 'true';
        console.log("isPullRequest: " + isPullRequest);
        const commitMessage = core.getInput('commit-message');
        console.log("commitMessage: " + commitMessage);
        console.log("core.getInput('parse-all-commits'): " + core.getInput('parse-all-commits'));
        const parseAllCommits = core.getInput('parse-all-commits') == 'true';
        console.log("parseAllCommits: " + parseAllCommits);
        const jsonPayload = JSON.stringify(github.context.payload, undefined, 2);
        // console.log("github context json payload: ", jsonPayload);
        const payload = github.context.payload;
        // console.log("github: ", github);

        const token = process.env['GITHUB_TOKEN'];
        console.log("github token: " + token);
        const octokit = new Octokit({
            auth: token,
        });

        if(isPullRequest) {
            let resultArr = [];

            console.log("is pull request...");
            // console.log("payload.repository.owner.login: " + payload.repository.owner.login);
            // console.log("payload.repository.name: " + payload.repository.name);
            // console.log("payload.number: " + payload.number);

            const owner = payload.repository.owner.login;
            const repo = payload.repository.name;
            const prNum = payload.number;

            const { data } = await octokit.pulls.listCommits({
                owner: owner,
                repo: repo,
                pull_number: prNum
            });
            // console.log("commits: ", data);

            data.forEach(item => {
                // console.log("commit: ", item.commit.message);
                const commit = item.commit;
                const matches = matchAll(commit.message, regex).toArray();
                matches.forEach(match => {
                    if(resultArr.find(element => element == match)) {
                        console.log(match + " is already included in result array");
                    } else {
                        console.log(" adding " + match + " to result array");
                        resultArr.push(match);
                    }
                });

            });

            const result = resultArr.join(',');
            console.log("result: ", result);
            core.setOutput("jira-keys", result);
        }
        else {
            console.log("not a pull request");

            if(commitMessage) {
                console.log("commit-message input val provided...");
                const matches = matchAll(commitMessage, regex).toArray();
                const result = matches.join(',');
                console.log("result: ", result);
                core.setOutput("jira-keys", result);
            }
            else {
                console.log("no commit-message input val provided...");
                const jsonPayload = JSON.stringify(github.context.payload, undefined, 2);
                // console.log("github context json payload: ", jsonPayload);
                const payload = github.context.payload;

                if(parseAllCommits) {
                    console.log("parse-all-commits input val is true");
                    let resultArr = [];

                    payload.commits.forEach(commit => {
                        // console.log("commit: ", commit);
                        const matches = matchAll(commit.message, regex).toArray();
                        matches.forEach(match => {
                            if(resultArr.find(element => element == match)) {
                                console.log(match + " is already included in result array");
                            } else {
                                console.log(" adding " + match + " to result array");
                                resultArr.push(match);
                            }
                        });

                    });

                    const result = resultArr.join(',');
                    console.log("result: ", result);
                    core.setOutput("jira-keys", result);
                }
                else {
                    console.log("parse-all-commits input val is false");
                    console.log("head_commit: ", payload.head_commit);
                    const matches = matchAll(payload.head_commit.message, regex).toArray();
                    const result = matches.join(',');
                    core.setOutput("jira-keys", result);
                }

            }
        }

    } catch (error) {
        core.setFailed(error.message);
    }
}

(async function () {
    await extractJiraKeysFromCommit();
    console.log("finished extracting jira keys from commit message");
})();
