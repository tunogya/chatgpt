# abandon.chat

A free conversational AI system that listens, learns, and challenges. Powered by OpenAI API.

## Start Wizard

1. Create a DynamoDB table. 
   
   > Set the partition key as PK, the sort key as SK, and the TTL field as TTL.

2. Create an OpenAI API key.
3. Create an Auth0 account.
4. Clone or download the project. 
5. Install the dependencies by running `npm install` or `yarn install`. 
6. Create a `.env` file and edit the environment variables. 
7. Run `npm run dev` or `yarn dev` to start the development server.

## Learn More

To learn more about this project, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [OpenAI API](https://beta.openai.com/docs/api-reference/introduction) - learn about OpenAI API.
- [DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html) - learn about DynamoDB.
- [Auth0](https://auth0.com/docs) - learn about Auth0.

## Deployments

You can deploy this project by Docker or AWS Elastic Beanstalk.

```bash
docker-compose up -d --build
```