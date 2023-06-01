const dotenv = require('dotenv');
const NotionManager = require("./notion");
const Auth0Manager = require("./auth0");
dotenv.config();

class Abot {
  constructor() {
    this.notion = new NotionManager({
      auth: process.env.NOTION_TOKEN,
    })
    this.auth0 = new Auth0Manager()
  }
  
  // get all users from Auth0 and sync them to Notion
  async syncAuth0UserDataToNotion() {
    const users = await this.auth0.getUsersFromAuth0();
    for (const user of users) {
      const notionUser = await this.notion.getUserInfoFromCRM(user);
      if (notionUser) {
        console.log('update user info in notion', user.email);
        await this.notion.updateCRMUserInfoByAuth0Data(notionUser.id, user);
      } else {
        console.log('insert user to notion', user.email);
        await this.notion.postCRMUserInfoByAuth0Data(user);
      }
    }
  }
}

(async () => {
  const abot = new Abot();
  const users = await abot.auth0.getUsersFromAuth0();
  for (const user of users) {
    const notionUser = await abot.notion.getUserInfoFromCRM(user);
    if (notionUser) {
      console.log('update user info in notion', user.email);
      await abot.notion.updateCRMUserInfoByAuth0Data(notionUser.id, user);
    } else {
      console.log('insert user to notion', user.email);
      await abot.notion.postCRMUserInfoByAuth0Data(user);
    }
  }
})();
