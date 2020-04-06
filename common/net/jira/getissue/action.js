const axios = require('axios');

class JiraGetIssueAction {
  constructor (jiraBaseUrl, jiraProject, jiraIssue, jiraToken) {
    this.baseUrl = jiraBaseUrl;
    this.project = jiraProject;
    this.issue = jiraIssue;
    this.token = jiraToken;
  }

  async execute () {
    console.log(`Issue to search jira for: ${this.issue}`)
    let config = {
      headers: {
          'Authorization': `Basic ${this.token}`,
      }
    }

    const response = await axios.get(`${this.baseUrl}/rest/api/3/issue/${this.issue}`, config);
    return response.data;
  }
}

module.exports = JiraGetIssueAction;