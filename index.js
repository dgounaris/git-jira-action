const core = require("@actions/core");
const github = require("@actions/github");
const axios = require('axios');

async function run() {
    try {
      const inputs = {
        token: core.getInput("token"),
        repository: core.getInput("repository"),
        owner: core.getInput("owner"),
      };
      core.debug(`Inputs: ${inspect(inputs)}`);

      const repository = inputs.repository
      ? inputs.repository
      : process.env.GITHUB_REPOSITORY;
      const repo = repository.split("/");
      core.debug(`repository: ${repository}`);

      const issueFirstComment = await getIssueFirstComment(inputs.owner, repo, '26')
      core.info(issueFirstComment);
    } catch (error) {
        core.error(error);
        core.setFailed(error.message);
    }
}

async function getIssueFirstComment(owner, repo, issue) {
    try {
        const response = await axios.get('https://api.github.com/repos/' + owner + '/' + repo + '/issues/' + issue + '/comments');
        core.info(response);
        return response;
    } catch (error) {
        core.error(error);
        return ''
    }
}

run();