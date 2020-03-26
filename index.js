const core = require("@actions/core");
const github = require("@actions/github");
const YAML = require('yaml');
const fs = require('fs');
const axios = require('axios');

const configPath = `${process.env.HOME}/jira/config.yml`
const Action = require('./action')

const config = YAML.parse(fs.readFileSync(configPath, 'utf8'))

async function run() {
    try {
      const inputs = {
        token: core.getInput("token"),
        owner: core.getInput("owner"),
        repository: core.getInput("repository"),
        issue: core.getInput("issue")
      };
      const repository = inputs.repository
      ? inputs.repository
      : process.env.GITHUB_REPOSITORY;
      const repo = repository.split("/");
      console.log(`repository: ${repository}`);

      const issueFirstComment = await getGithubIssueFirstComment(inputs.owner, repo, issue)
      console.log('First commit message: ' + issueFirstComment);
      
      const jiraIssueKey = issueFirstComment.split(' ').pop();
      const issue = getJiraIssueStatus();
      console.log(issue);
    } catch (error) {
        core.error(error);
        core.setFailed(error.message);
    }
}

async function getGithubIssueFirstComment(owner, repo, issue) {
    try {
        const response = await axios.get('https://api.github.com/repos/' + owner + '/' + repo + '/issues/' + issue + '/comments');
        console.log('Full response:\n');
        console.log(response)
        console.log('\n')
        return response.data[0].body;
    } catch (error) {
        core.error(error);
        return '';
    }
}

async function getJiraIssueStatus() {
    return await new Action({
        config,
        jiraIssue
    }).execute()
}

run();