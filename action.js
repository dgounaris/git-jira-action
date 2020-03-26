// shoutout to https://github.com/atlassian/gajira-find-issue-key

const _ = require('lodash')
const Jira = require('./Jira')

module.exports = class {
  constructor ({ config, jiraIssue }) {
    this.Jira = new Jira({
      baseUrl: config.baseUrl,
      token: config.token,
      email: config.email,
    })

    this.jiraIssue = jiraIssue
  }

  async execute () {
      console.log(`Issue to search jira for: ${this.jiraIssue}`)
    return await this.Jira.getIssue(this.jiraIssue)
  }
}