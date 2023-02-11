/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    JWT_SECRET: process.env.JWT_SECRET,
    MY_AWS_ACCESS_KEY_ID: process.env.MY_AWS_ACCESS_KEY_ID,
    MY_AWS_SECRET_ACCESS_KEY: process.env.MY_AWS_SECRET_ACCESS_KEY,
    NEXT_PUBLIC_SALT: process.env.NEXT_PUBLIC_SALT
  }
}

module.exports = nextConfig
