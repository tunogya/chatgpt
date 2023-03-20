# ChatGPT

A replica of a chatbot application powered by GPT-3.

- Next.js
- Tailwind CSS
- DynamoDB

## Start Wizard

1. Create a DynamoDB table and set the partition key as PK, the sort key as SK, and the TTL field as TTL.
2. Clone or download the project.
3. Install the dependencies by running `npm install` or `yarn install`.
4. Create a `.env.local` file and add the following environment variables:
    
    ```
    JWT_SECRET=(required for Auth)
    MY_AWS_ACCESS_KEY_ID=(required for DB)
    MY_AWS_SECRET_ACCESS_KEY=(required for DB)
    SALT=(required for Auth)
    OPENAI_API_SECRET=(required for OpenAI)
    BOT_TOKEN=(optional for Telegram login)
    ```
   
5. Run `npm run dev` or `yarn dev` to start the development server.

## Learn More

To learn more about this project, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [OpenAI API](https://beta.openai.com/docs/api-reference/introduction) - learn about OpenAI API.
- [DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html) - learn about DynamoDB.

## Deployments

You can deploy this project by PM2. Vercel is not supported because of the Server Sent Event.

```bash
npm install -g pm2
npm install
npm run build
pm2 start ecosystem.config.js
```