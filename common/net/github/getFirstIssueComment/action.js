const axios = require('axios');

class GetFirstIssueCommentAction {
    constructor (owner, repo, issue, token) {
      this.owner = owner;
      this.repo = repo;
      this.issue = issue;
      this.token = token;
    }
  
    async execute() {
      let config = {
          headers: {
            'Authorization': `token ${this.token}`,
          }
        }
      const response = await axios.get(`https://api.github.com/repos/${this.owner}/${this.repo}/issues/${this.issue}/comments`, config);
      //console.log('Full response:\n');
      //console.log(response)
      //console.log('\n')
      if (response.data.length == 0) {
        return '';
      } else {
        return response.data[0].body;
      }
    }
}

module.exports = GetFirstIssueCommentAction;