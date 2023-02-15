/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    JWT_SECRET: process.env.JWT_SECRET,
    MY_AWS_ACCESS_KEY_ID: process.env.MY_AWS_ACCESS_KEY_ID,
    MY_AWS_SECRET_ACCESS_KEY: process.env.MY_AWS_SECRET_ACCESS_KEY,
    SALT: process.env.SALT,
    OPENAI_API_SECRET: process.env.OPENAI_API_SECRET,
    BOT_TOKEN: process.env.BOT_TOKEN
  }
}

module.exports = nextConfig
