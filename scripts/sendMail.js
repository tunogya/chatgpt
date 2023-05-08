const {DynamoDBClient} = require('@aws-sdk/client-dynamodb');
const {DynamoDBDocumentClient, BatchWriteCommand} = require('@aws-sdk/lib-dynamodb');
const fetch = require('node-fetch');
const dotenv = require('dotenv');

dotenv.config();

const ddbClient = new DynamoDBClient({
  region: 'ap-northeast-1'
});

const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, {
  marshallOptions: {
    convertEmptyValues: true,
    removeUndefinedValues: true,
  },
});

const getBearerToken = async () => {
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
  return data.access_token
}


const getUsers = async (key) => {
  const res = await fetch('https://abandon.jp.auth0.com/api/v2/users', {
    headers: {
      'Authorization': 'Bearer ' + key,
    }
  })
  return await res.json()
}

const main = async () => {
  const key = await getBearerToken()
  const users = await getUsers(key)
  console.log(users)
}

main()