const {DynamoDBClient} = require("@aws-sdk/client-dynamodb");
const {DynamoDBDocumentClient} = require("@aws-sdk/lib-dynamodb");
const fetch = require("node-fetch");
const dotenv = require('dotenv');
const {Client, LogLevel} = require("@notionhq/client");

dotenv.config();

class Abot {
  constructor() {
    this.name = 'Abot';
    this.ddbClient = new DynamoDBClient({
      region: 'ap-northeast-1'
    });
    this.ddbDocClient = DynamoDBDocumentClient.from(this.ddbClient, {
      marshallOptions: {
        convertEmptyValues: true,
        removeUndefinedValues: true,
      },
    });
    this.notion = new Client({
      auth: process.env.NOTION_TOKEN,
      logLevel: LogLevel.DEBUG,
    })
    this.getBearerToken();
    this.database_id = '77414699b6864b6986c53c18457731d3'
  }
  
  async getBearerToken() {
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
  
  async getUsers() {
    if (!this.auth0_access_token) {
      await this.getBearerToken();
    }
    // TODO
    const res = await fetch(`https://abandon.jp.auth0.com/api/v2/users?page=0&per_page=100`, {
      headers: {
        'Authorization': 'Bearer ' + this.auth0_access_token,
      }
    })
    return await res.json()
    // {
    //     created_at: '2023-05-16T08:39:09.980Z',
    //     email: 'hr@cision.cc',
    //     email_verified: false,
    //     identities: [ [Object] ],
    //     name: 'hr@cision.cc',
    //     nickname: 'hr',
    //     picture: 'https://s.gravatar.com/avatar/3b990d9cb3b660ca72c43b2f21da99dd?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fhr.png',
    //     updated_at: '2023-05-31T14:25:00.090Z',
    //     user_id: 'auth0|6463412d864b3992b896fabc',
    //     username: 'dinghao',
    //     last_login: '2023-05-31T14:25:00.090Z',
    //     last_ip: '220.246.124.152',
    //     logins_count: 22
    //   },
  }
  
  async postToCRM(user) {
    try {
      await this.notion.pages.create({
        parent: {
          type: "database_id",
          database_id: this.database_id,
        },
        properties: {
          'Created At': {
            id: '%5Dogk',
            type: 'date',
            date: {
              start: user.created_at.split('T')[0],
              end: null,
              time_zone: null,
            }
          },
          'User Id': {
            id: 'V%3D~Q',
            type: 'rich_text',
            rich_text: [
              {
                type: 'text',
                text: {
                  content: user.user_id,
                },
                plain_text: user.user_id,
                href: null,
              }
            ]
          },
          Name: {
            id: 'title',
            type: 'title',
            title: [
              {
                type: 'text',
                text: {
                  content: user.username || user.email,
                },
                plain_text: user.username || user.email,
              }
            ]
          },
          Email: {
            id: 'yl%40Y',
            type: 'email',
            email: user.email,
          },
          'Email Verified': {
            id: 'Q%3F%3Ed',
            type: 'checkbox',
            checkbox: user.email_verified,
          },
          Picture: {
            id: 'J%3AIm',
            type: 'url',
            url: user.picture,
          },
          'Last Login': {
            id: '%5Dx%3F~',
            type: 'date',
            date: {
              start: user.last_login.split('T')[0],
              end: null,
              time_zone: null,
            }
          },
          'Last IP': {
            id: 'Dyv%3B',
            type: 'rich_text',
            rich_text: [
              {
                type: 'text',
                text: {
                  content: user.last_ip,
                },
                plain_text: user.last_ip,
                href: null,
              }
            ]
          },
          'Logins Count': {
            id: '40Yd',
            type: 'number',
            number: user.logins_count,
          },
          'Free Expiration': {
            id: 'EmTC',
            type: 'date',
            date: null,
          },
          'Paid Expiration': {
            id: 'Pdqy',
            type: 'date',
            date: null,
          }
        }
      });
      console.log("Success! Entry added:", user.user_id);
    } catch (e) {
      console.error("Error! Entry not added:", user.user_id, e);
    }
  }
}

const abot = new Abot();
abot.getUsers().then(async (users) => {
  for (const user of users) {
    await abot.postToCRM(user);
  }
});