const dotenv = require('dotenv');
const NotionManager = require("./notion");
const Auth0Manager = require("./auth0");
const DynamoDBManager = require("./dynamodb");
dotenv.config();

class Abot {
  constructor() {
    this.notion = new NotionManager({
      auth: process.env.NOTION_TOKEN,
    })
    this.auth0 = new Auth0Manager()
    this.ddb = new DynamoDBManager()
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
  
  async syncMetadataToNotion() {
    // get all users from notion
    const users = await this.notion.getAllCRMUsers();
    console.log(users.length, 'users fetched from Notion')
    for (const user of users) {
      const page_id = user.id
      const user_id = user.properties['User Id'].rich_text[0].plain_text;
      if (!user_id || !page_id) {
        console.log('user_id or page_id not found for user', user.properties['User Id'].rich_text[0].plain_text);
        continue;
      }
      // get user metadata from dynamodb
      const metadata = await this.ddb.getUserMetadataFromDDB(user_id);
      await this.ddb.updatePageIdToMetadata(user_id, page_id);
      console.log('update ddb metadata: add page_id for ', user_id)
      if (metadata) {
        const paidUseTTL = metadata?.paidUseTTL || 0;
        const freeUseTTL = metadata?.freeUseTTL || 0;
        if (paidUseTTL === 0 && freeUseTTL === 0) {
          console.log('paidUseTTL and freeUseTTL are both 0 for user', user_id);
          continue;
        }
        const freeExpiration = new Date(freeUseTTL * 1000).toISOString();
        const paidExpiration = new Date(paidUseTTL * 1000).toISOString();
        await this.notion.updateCRMUserMetadata(page_id, freeExpiration, paidExpiration);
        console.log('update notion metadata for user', user_id);
      }
    }
  }
}

(async () => {
  const abot = new Abot();
  await abot.syncMetadataToNotion();
})();
