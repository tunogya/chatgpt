const {DynamoDBClient} = require("@aws-sdk/client-dynamodb");
const {DynamoDBDocumentClient, GetCommand, UpdateCommand} = require("@aws-sdk/lib-dynamodb");

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
  
  async updatePageIdToMetadata(user_id, page_id) {
    try {
      await this.ddbDocClient.send(new UpdateCommand({
        TableName: 'wizardingpay',
        Key: {
          PK: user_id,
          SK: `METADATA#chatgpt`,
        },
        UpdateExpression: 'SET page_id = :page_id',
        ExpressionAttributeValues: {
          ':page_id': page_id,
        },
        ConditionExpression: 'attribute_exists(PK)',
      }));
    } catch (e) {
      console.log('update page_id in ddb error', user_id)
    }
  }
}

module.exports = DynamodbManager;