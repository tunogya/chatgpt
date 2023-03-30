import {GetCommand, PutCommand, UpdateCommand} from "@aws-sdk/lib-dynamodb";
import {ddbDocClient} from "./DynamoDB";
import {getCurrentWeekId} from "@/utils/DateUtil";

export const addConversationNow = async (user_id: string) => {
  const week = getCurrentWeekId();
  ddbDocClient.send(new GetCommand({
    TableName: 'wizardingpay',
    Key: {
      PK: user_id,
      SK: `WEEK#${week}`,
    }
  }))
    .then((data) => {
      if (!data.Item) {
        const index = new Date().getDay() // 0-6
        let new_item = {
          PK: user_id,
          SK: `WEEK#${week}`,
          conversation: [0, 0, 0, 0, 0, 0, 0],
          rewards: {
            '1D': {
              available: 0,
              received: 0,
            },
            '2D': {
              available: 0,
              received: 0,
            },
            '4D': {
              available: 0,
              received: 0,
            },
            '7D': {
              available: 0,
              received: 0,
            }
          },
          created: Math.floor(Date.now() / 1000),
          updated: Math.floor(Date.now() / 1000),
        }
        new_item.conversation[index] += 1
        const validDays = new_item.conversation.filter((item) => item > 0).length
        if (validDays >= 7) {
          new_item.rewards['7D'].available = 1
        } else if (validDays >= 4) {
          new_item.rewards['4D'].available = 1
        } else if (validDays >= 2) {
          new_item.rewards['2D'].available = 1
        } else if (validDays >= 1) {
          new_item.rewards['1D'].available = 1
        }
        ddbDocClient.send(new PutCommand({
          TableName: 'wizardingpay',
          Item: new_item,
          ConditionExpression: 'attribute_not_exists(PK)',
        })).catch((err) => {
          console.log(err)
        })
      } else {
        let new_item = data.Item
        const index = new Date().getDay() // 0-6
        new_item.conversation[index] += 1
        const validDays = new_item.conversation.filter((item: number) => item > 0).length
        if (validDays >= 7) {
          new_item.rewards['7D'].available = 1
        } else if (validDays >= 4) {
          new_item.rewards['4D'].available = 1
        } else if (validDays >= 2) {
          new_item.rewards['2D'].available = 1
        } else if (validDays >= 1) {
          new_item.rewards['1D'].available = 1
        }
        ddbDocClient.send(new UpdateCommand({
          TableName: 'wizardingpay',
          Key: {
            PK: user_id,
            SK: `WEEK#${week}`,
          },
          UpdateExpression: 'SET conversation = :conversation, rewards = :rewards, updated = :updated',
          ExpressionAttributeValues: {
            ':conversation': new_item.conversation,
            ':rewards': new_item.rewards,
            ':updated': Math.floor(Date.now() / 1000),
          }
        })).catch((err) => {
          console.log(err)
        })
      }
    })
    .catch((err) => {
      console.log(err)
    })
}