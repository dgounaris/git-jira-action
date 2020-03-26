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
      const repo = getSanitizedRepo(inputs.repository)

      operateForIssue(inputs.owner, repo, inputs.issue, inputs.token);
    } catch (error) {
        core.error(error);
        core.setFailed(error.message);
    }
}

async function getSanitizedRepo(rawRepo) {
    const repository = rawRepo
      ? rawRepo
      : process.env.GITHUB_REPOSITORY;
    const repo = repository.split("/");
    console.log(`repository: ${repository}`);
    return repo;
}

async function operateForIssue(owner, repo, issue, token) {
    const issueFirstComment = await getGithubIssueFirstComment(owner, repo, issue)
    console.log('First commit message: ' + issueFirstComment);
    const jiraIssueKey = issueFirstComment.split(' ').pop();
    
    const jiraIssueStatus = await getJiraIssueStatus(jiraIssueKey);
    console.log(jiraIssueStatus);

    if (jiraIssueStatus === 'Done') {
        closeGithubIssue(owner, repo, issue, token);
    }
}

async function getGithubIssueFirstComment(owner, repo, issue) {
    try {
        const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/issues/${issue}/comments`);
        console.log('Full response:\n');
        console.log(response)
        console.log('\n')
        return response.data[0].body;
    } catch (error) {
        core.error(error);
        return '';
    }
}

async function closeGithubIssue(owner, repo, issue, token) {
    try {
        let config = {
            headers: {
              'Authorization': `token ${token}`,
            }
          }
          
          let data = {
            'state': 'closed'
          }
        const response = await axios.patch(`https://api.github.com/repos/${owner}/${repo}/issues/${issue}`, data, config);
        console.log('Github ticket post patch:\n');
        console.log(response);
    } catch (error) {
        core.error(error);
        return '';
    }
}

async function getJiraIssueStatus(jiraIssue) {
    const issue = await new Action({
        config,
        jiraIssue
    }).execute()
    console.log('Jira issue retrieved:\n');
    console.log(issue);
    console.log('\n');
    const issueStatus = issue.fields.status.name;
    return issueStatus;
}

run();