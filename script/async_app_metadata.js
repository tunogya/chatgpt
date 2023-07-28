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
  const allUsers = await auth0Management.getUsers({
    per_page: 100,
    page: 2,
    sort: 'created_at:1',
  })
  console.log(allUsers.length, '人')
  for (const user of allUsers) {
    console.log(user.user_id)
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
  }
}

main()