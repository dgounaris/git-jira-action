const axios = require('axios');

class JiraGetIssueAction {
  constructor (jiraBaseUrl, jiraProject, jiraIssue, jiraToken) {
    this.baseUrl = jiraBaseUrl;
    this.project = jiraProject;
    this.issue = jiraIssue;
    this.token = jiraToken;
  }

  async execute () {
    console.log(`Issue to search jira for: ${this.jiraIssue}`)
    let config = {
      headers: {
          'Authorization': `Basic ${this.token}`,
      }
    }

    return await axios.get(`${this.baseurl}/rest/api/3/issue/${this.issue}`, config);
  }
}

module.exports = JiraGetIssueAction;