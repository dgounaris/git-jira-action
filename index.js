const core = require("@actions/core");
const github = require("@actions/github");
const axios = require('axios');

async function run() {
    try {
      const inputs = {
        token: core.getInput("token"),
        owner: 'dgounaris',
        repository: 'test-jira-actions'
      };
      console.log(`Inputs: ${inputs}`);

      const repository = inputs.repository
      ? inputs.repository
      : process.env.GITHUB_REPOSITORY;
      const repo = repository.split("/");
      console.log(`repository: ${repository}`);

      const issueFirstComment = await getIssueFirstComment(inputs.owner, repo, '26')
      console.log('First commit message: ' + issueFirstComment);
    } catch (error) {
        core.error(error);
        core.setFailed(error.message);
    }
}

async function getIssueFirstComment(owner, repo, issue) {
    try {
        const response = await axios.get('https://api.github.com/repos/' + owner + '/' + repo + '/issues/' + issue + '/comments');
        console.log('Full response:\n');
        console.log(response)
        console.log('\n')
        return response.data[0].body;
    } catch (error) {
        core.error(error);
        return ''
    }
}

run();