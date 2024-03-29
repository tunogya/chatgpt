import {ManagementClient} from "auth0"

const auth0Management = new ManagementClient({
  clientId: process.env.AUTH0_MANAGEMENT_CLIENT_ID,
  clientSecret: process.env.AUTH0_MANAGEMENT_CLIENT_SECRET,
  domain: process.env.AUTH0_ISSUER_BASE_URL!.replace('https://', ''),
})

export default auth0Management