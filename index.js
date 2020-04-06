const core = require("@actions/core");

const JiraGetIssueAction = require('./common/net/jira/getissue/action');
const CloseIssueAction = require('./common/net/github/closeIssue/action');
const GetAllIssuesAction = require('./common/net/github/getAllIssues/action');
const GetFirstIssueCommentAction = require('./common/net/github/getFirstIssueComment/action');

async function run() {
    try {
      const inputs = {
        jiraBaseUrl: core.getInput('jiraBaseUrl'),
        project: core.getInput('project'),
        jiraEmail: core.getInput('jiraEmail'),
        jiraToken: core.getInput('jiraToken'),
        token: core.getInput("token"),
        owner: core.getInput("owner"),
        repository: core.getInput("repository")
      };
      const base64token = Buffer.from(`${inputs.jiraEmail}:${inputs.jiraToken}`).toString('base64');
      const repo = await getSanitizedRepo(inputs.repository)

      const issues = await new GetAllIssuesAction(inputs.owner, repo, inputs.token).execute();
      issues.data.forEach(async (issue) => {
          const issueNumber = issue.number;
          console.log(`Operating for issue: ${issueNumber}`);
          await operateForIssue(inputs.owner, repo, issueNumber, inputs.token, inputs.jiraBaseUrl, inputs.project, base64token);
      });
    } catch (error) {
        console.log(error);
        process.exit(1);
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

async function operateForIssue(owner, repo, issue, token, jiraBaseUrl, jiraProject, jiraToken) {
    const issueFirstComment = await new GetFirstIssueCommentAction(owner, repo, issue, token).execute();
    console.log('First commit message: ' + issueFirstComment);

    if (!(/^Automatically created Jira issue: [A-Z]+-\d+/.test(issueFirstComment))) {
        return;
    }

    const jiraIssueKey = issueFirstComment.split(' ').pop();
    const jiraIssueStatus = await getJiraIssueStatus(jiraBaseUrl, jiraProject, jiraIssueKey, jiraToken);
    console.log(jiraIssueStatus);

    if (jiraIssueStatus === 'Done') {
       await new CloseIssueAction(owner, repo, issue, token).execute();
    }
}

async function getJiraIssueStatus(jiraBaseUrl, jiraProject, jiraIssue, jiraToken) {
    const issue = await new JiraGetIssueAction(
        jiraBaseUrl,
        jiraProject,
        jiraIssue,
        jiraToken
    ).execute()
    //console.log('Jira issue retrieved:\n');
    //console.log(issue);
    //console.log('\n');
    const issueStatus = issue.fields.status.name;
    return issueStatus;
}

run();