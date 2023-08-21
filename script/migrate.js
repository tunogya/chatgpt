const {ManagementClient} = require('auth0');
const dotenv = require('dotenv');
const Stripe = require('stripe');
const mysql = require('mysql2');

dotenv.config();

const connection = mysql.createConnection(process.env.DATABASE_URL);
console.log('Connected to PlanetScale!');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

const auth0Management = new ManagementClient({
  clientId: process.env.AUTH0_MANAGEMENT_CLIENT_ID,
  clientSecret: process.env.AUTH0_MANAGEMENT_CLIENT_SECRET,
  domain: process.env.AUTH0_ISSUER_BASE_URL.replace('https://', '')
});

auth0Management.getUsers({
  per_page: 100,
  page: 3,
})
    .then((users) => {
      const userValues = users.map((u) => [
        new Date(u.created_at),
        u.email,
        u.email_verified,
        u.name,
        u.nickname,
        u.picture,
        new Date(u.updated_at),
        u.user_id,
        u.username,
        new Date(u.last_login),
        u.last_ip,
        u.logins_count,
        new Date(u?.app_metadata?.chatgpt_standard ?? 0),
        new Date(u?.app_metadata?.chatgpt_plus ?? 0),
      ]);
      
      const columns = [
        'created_at',
        'email',
        'email_verified',
        'name',
        'nickname',
        'picture',
        'updated_at',
        'user_id',
        'username',
        'last_login',
        'last_ip',
        'logins_count',
        'chatgpt_standard',
        'chatgpt_plus',
      ];
      
      const query = `INSERT INTO users (${columns.join(', ')}) VALUES ? ON DUPLICATE KEY UPDATE last_login=VALUES(last_login), last_ip=VALUES(last_ip), logins_count=VALUES(logins_count), updated_at=VALUES(updated_at), chatgpt_standard=VALUES(chatgpt_standard), chatgpt_plus=VALUES(chatgpt_plus)`;
      
      connection.query(query, [userValues], (err, result, fields) => {
        if (err) {
          console.log(err);
        }
        console.log('success', users.map(u => u.username));
      });
      connection.end();
    })