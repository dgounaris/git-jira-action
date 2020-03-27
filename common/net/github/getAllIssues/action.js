const axios = require('axios');

class GetAllIssuesAction {
    constructor (owner, repo, token) {
      this.owner = owner;
      this.repo = repo;
      this.token = token;
    }
  
    async execute() {
        let config = {
            headers: {
                'Authorization': `token ${this.token}`,
            }
            }
        const response = await axios.get(`https://api.github.com/repos/${this.owner}/${this.repo}/issues`, config);
        console.log('Full response:\n');
        console.log(response)
        console.log('\n')
        return response;
    }
}

module.exports = GetAllIssuesAction;