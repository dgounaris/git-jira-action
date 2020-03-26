const _ = require('lodash')
const Jira = require('./Jira')

const issueIdRegEx = /([a-zA-Z0-9]+-[0-9]+)/g

const eventTemplates = {
  branch: '{{event.ref}}',
  commits: "{{event.commits.map(c=>c.message).join(' ')}}",
}

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
    return await this.Jira.getIssue(issueKey)
  }
}