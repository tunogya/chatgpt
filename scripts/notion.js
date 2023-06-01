const {Client, LogLevel} = require("@notionhq/client")
const dotenv = require('dotenv');

dotenv.config();

// Initializing a client
const notion = new Client({
      auth: process.env.NOTION_TOKEN,
      logLevel: LogLevel.DEBUG,
    })

;(async () => {
  const res = await notion.databases.query({
    database_id: "77414699b6864b6986c53c18457731d3",
  });
})();

// {
//   'Last IP': { id: 'Dyv%3B', type: 'rich_text', rich_text: [] },
//   'Free Expiration': { id: 'EmTC', type: 'date', date: null },
//   'Paid Expiration': { id: 'Pdqy', type: 'date', date: null },
//   'Email Verified': { id: 'Q%3F%3Ed', type: 'checkbox', checkbox: false },
//   'User Id': { id: 'V%3D~Q', type: 'rich_text', rich_text: [] },
//   'Created At': { id: '%5Dogk', type: 'date', date: null },
//   'Last Login': { id: '%5Dx%3F~', type: 'date', date: null },
//   'Logins Count': { id: 'a%40Yd', type: 'number', number: null },
//   Email: { id: 'yl%40Y', type: 'email', email: null },
//   Name: { id: 'title', type: 'title', title: [] }
// }