import { handleAuth } from '@auth0/nextjs-auth0';

/**
 * https://github.com/auth0/nextjs-auth0
 * Executing handleAuth() creates the following route handlers under the hood that perform different parts of the authentication flow:
 *
 * /api/auth/login: Your Next.js application redirects users to your identity provider for them to log in (you can optionally pass a returnTo parameter to return to a custom relative URL after login, for example /api/auth/login?returnTo=/profile).
 * /api/auth/callback: Your identity provider redirects users to this route after they successfully log in.
 * /api/auth/logout: Your Next.js application logs out the user.
 * /api/auth/me: You can fetch user profile information in JSON format.
 *
 * Note: handleAuth requires Node.js and so will not work on Cloudflare Workers or Vercel Edge Runtime.
 */

export default handleAuth();
