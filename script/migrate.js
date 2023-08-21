const {ManagementClient} = require('auth0');
const dotenv = require('dotenv');
const Stripe = require('stripe');
const mysql = require('mysql2')

dotenv.config();

const connection = mysql.createConnection(process.env.DATABASE_URL)
console.log('Connected to PlanetScale!')

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

const auth0Management = new ManagementClient({
  clientId: process.env.AUTH0_MANAGEMENT_CLIENT_ID,
  clientSecret: process.env.AUTH0_MANAGEMENT_CLIENT_SECRET,
  domain: process.env.AUTH0_ISSUER_BASE_URL.replace('https://', '')
})

auth0Management.getUsers({
  per_page: 100,
  page: 3,
})
    .then((r) => {
      r.forEach(u => {
        connection.query('INSERT INTO users (created_at, email, email_verified, name, nickname, picture, updated_at, user_id, username, last_login, last_ip, logins_count, chatgpt_standard, chatgpt_plus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE last_login=?, last_ip=?, logins_count=?, updated_at=?, chatgpt_standard=?, chatgpt_plus=?',
            [new Date(u.created_at), u.email, u.email_verified, u.name, u.nickname, u.picture, new Date(u.updated_at), u.user_id, u.username, new Date(u.last_login), u.last_ip, u.logins_count, new Date(u?.app_metadata?.chatgpt_standard ?? 0), new Date(u?.app_metadata?.chatgpt_plus ?? 0), new Date(u.last_login), u.last_ip, u.logins_count, new Date(u.updated_at), new Date(u?.app_metadata?.chatgpt_standard ?? 0), new Date(u?.app_metadata?.chatgpt_plus ?? 0)], (err, result, fields) => {
              if (err) {
                console.log(err)
              }
              console.log('success', u.username)
            })
      })
    })
    .then(() => {
      console.log("done")
      connection.end()
    })