const { ManagementClient } = require('auth0')
const dotenv = require('dotenv')

dotenv.config()

const {DynamoDBClient} = require("@aws-sdk/client-dynamodb");
const {DynamoDBDocumentClient, GetCommand, UpdateCommand, QueryCommand} = require("@aws-sdk/lib-dynamodb");

class DynamodbManager {
  constructor() {
    const ddbClient = new DynamoDBClient({
      region: 'ap-northeast-1'
    });
    this.ddbDocClient = DynamoDBDocumentClient.from(ddbClient, {
      marshallOptions: {
        convertEmptyValues: true,
        removeUndefinedValues: true,
      },
    });
  }
  
  // get metadata from dynamodb
  async getUserMetadataFromDDB(user_id) {
    const res = await this.ddbDocClient.send(new GetCommand({
      TableName: 'wizardingpay',
      Key: {
        PK: user_id,
        SK: 'METADATA#chatgpt',
      }
    }));
    return res.Item;
  }
}

const auth0Management = new ManagementClient({
  clientId: process.env.AUTH0_MANAGEMENT_CLIENT_ID,
  clientSecret: process.env.AUTH0_MANAGEMENT_CLIENT_SECRET,
  domain: "abandon.jp.auth0.com"
})

const ddbManager = new DynamodbManager();

const main = async () => {
  let allUsers = []
  const page0 = await auth0Management.getUsers({
    per_page: 100,
    page: 0,
  })
  const page1 = await auth0Management.getUsers({
    per_page: 100,
    page: 1,
  })
  const page2 = await auth0Management.getUsers({
    per_page: 100,
    page: 2,
  })
  const page3 = await auth0Management.getUsers({
    per_page: 100,
    page: 3,
  })
  allUsers = allUsers.concat(page0).concat(page1).concat(page2).concat(page3)
  console.log(allUsers.length)
  
  for (const user of allUsers) {
    if (!user?.app_metadata?.vip?.chatgpt_standard) {
      const metadata = await ddbManager.getUserMetadataFromDDB(user.user_id)
      if (metadata) {
        const paidUseTTL = new Date(metadata.paidUseTTL * 1000)
        await auth0Management.updateAppMetadata({
          id: user.user_id,
        }, {
          vip: {
            chatgpt_standard: paidUseTTL.toISOString(),
          }
        })
        await auth0Management.updateUserMetadata({
          id: user.user_id,
        }, {
          vip: null,
        })
      }
      console.log(user.name, 'update app_metadata')
    } else {
      console.log(user.name, user?.app_metadata?.vip?.chatgpt_standard)
    }
  }
}

main()