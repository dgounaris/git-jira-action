const core = require("@actions/core");
const github = require("@actions/github");
const axios = require('axios');

async function run() {
    try {
      const inputs = {
        token: core.getInput("token"),
        repository: core.getInput("repository"),
        project: core.getInput("project"),
        commentId: core.getInput("issue"),
        body: core.getInput("body"),
        editMode: core.getInput("edit-mode"),
        reactionType: core.getInput("reaction-type")
      };
      core.debug(`Inputs: ${inspect(inputs)}`);

      const repository = inputs.repository
      ? inputs.repository
      : process.env.GITHUB_REPOSITORY;
      const repo = repository.split("/");
      core.debug(`repository: ${repository}`);

      const issueFirstComment = await getIssueFirstComment('dgounaris', 'test-jira-actions', '26')
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