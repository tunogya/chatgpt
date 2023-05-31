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
  const res = await fetch(`https://abandon.jp.auth0.com/api/v2/users?page=4`, {
    headers: {
      'Authorization': 'Bearer ' + key,
    }
  })
  return await res.json()
}

const main = async () => {
  const key = await getBearerToken()
  const users = await getUsers(key)
  console.log(users.length)
  //   {
  //     created_at: '2023-05-25T09:16:22.398Z',
  //     email: '870058418@qq.com',
  //     email_verified: false,
  //     identities: [ [Object] ],
  //     name: '870058418@qq.com',
  //     nickname: '870058418',
  //     picture: 'https://s.gravatar.com/avatar/ce46a6538207dacded567a00fceeeecc?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2F87.png',
  //     updated_at: '2023-05-25T09:16:22.398Z',
  //     user_id: 'auth0|646f27664496e4f3de1bb2ee',
  //     username: 'angelawsj',
  //     last_login: '2023-05-25T09:16:22.396Z',
  //     last_ip: '2409:8920:4c11:90f1:8db5:13bc:cfb:cf13',
  //     logins_count: 1
  //   }
  
  
  
}

main()