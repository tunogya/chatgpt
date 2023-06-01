const fetch = require("node-fetch");

class Auth0Manager {
  constructor() {
    this.auth0_access_token = null;
  }
  
  async getAuth0BearerToken() {
    const res = await fetch('https://abandon.jp.auth0.com/oauth/token', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.AUTH0_ADMIN_CLIENT_ID,
        client_secret: process.env.AUTH0_ADMIN_CLIENT_SECRET,
        audience: 'https://abandon.jp.auth0.com/api/v2/',
        grant_type: 'client_credentials',
      }),
    })
    const data = await res.json()
    this.auth0_access_token = data.access_token
  }
  
  
  /*
    Users from Auth0 have the following properties:
      @param {string} created_at
      @param {string} email
      @param {boolean} email_verified
      @param {string} name
      @param {string} nickname
      @param {string} picture
      @param {string} updated_at
      @param {string} user_id
      @param {string} username
      @param {string} last_login
      @param {string} last_ip
      @param {number} logins_count
   */
  async getUsersFromAuth0() {
    if (!this.auth0_access_token) {
      await this.getAuth0BearerToken();
    }
    let users = [];
    let page = 0;
    while (true) {
      const res = await fetch(`https://abandon.jp.auth0.com/api/v2/users?page=${page}&per_page=100`, {
        headers: {
          'Authorization': 'Bearer ' + this.auth0_access_token,
        }
      })
      const data = await res.json()
      if (data.length === 0) {
        break;
      }
      page++;
      users = users.concat(data);
    }
    console.log(users.length, 'users fetched from Auth0')
    return users;
  }
}

module.exports = Auth0Manager;