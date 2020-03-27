const core = require("@actions/core");
const github = require("@actions/github");
const YAML = require('yaml');
const fs = require('fs');

const configPath = `${process.env.HOME}/jira/config.yml`;
const JiraGetIssueAction = require('./common/net/jira/getissue/action');
const CloseIssueAction = require('./common/net/github/closeIssue/action');
const GetAllIssuesAction = require('./common/net/github/getAllIssues/action');
const GetFirstIssueCommentAction = require('./common/net/github/getFirstIssueComment/action');

//const config = YAML.parse(fs.readFileSync(configPath, 'utf8'));

async function run() {
    try {
      const inputs = {
        token: core.getInput("token"),
        owner: core.getInput("owner"),
        repository: core.getInput("repository")
      };
      const repo = await getSanitizedRepo(inputs.repository)

      const issues = await new GetAllIssuesAction(inputs.owner, repo, inputs.token).execute();
      issues.data.forEach(async (issue) => {
          const issueNumber = issue.number;
          console.log(`Operating for issue: ${issueNumber}`);
          await operateForIssue(inputs.owner, repo, issueNumber, inputs.token);
      });
    } catch (error) {
        console.log(error);
    }
}

async function getSanitizedRepo(rawRepo) {
    const repository = rawRepo
      ? rawRepo
      : process.env.GITHUB_REPOSITORY;
    const repo = repository.split("/");
    console.log(`repository: ${repo}`);
    return repo;
}

async function operateForIssue(owner, repo, issue, token) {
    const issueFirstComment = await new GetFirstIssueCommentAction(owner, repo, issue, token).execute();
    console.log('First commit message: ' + issueFirstComment);

    if (!(/^Automatically created Jira issue: [A-Z]+-\d+/.test(issueFirstComment))) {
        return;
    }

    const jiraIssueKey = issueFirstComment.split(' ').pop();
    const jiraIssueStatus = await getJiraIssueStatus(jiraIssueKey);
    console.log(jiraIssueStatus);

    if (jiraIssueStatus === 'Done') {
       await new CloseIssueAction(owner, repo, issue, token).execute();
    }
}

async function getJiraIssueStatus(jiraIssue) {
    const issue = await new JiraGetIssueAction({
        config,
        jiraIssue
    }).execute()
    //console.log('Jira issue retrieved:\n');
    //console.log(issue);
    //console.log('\n');
    const issueStatus = issue.fields.status.name;
    return issueStatus;
}

run();