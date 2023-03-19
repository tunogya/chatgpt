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

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deployments

You can deploy this project by PM2. Vercel is not supported because of the Server Sent Event.

```bash
npm install -g pm2
pm2 start npm --name "chatgpt" -- start
```