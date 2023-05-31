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
  for (const page of res.results) {
    console.log(page.properties['Last IP'])
  }
})();

// {
//   'Last IP': { id: 'Dyv%3B', type: 'rich_text', rich_text: [ [Object] ] },
//   'Free Expiration': {
//     id: 'EmTC',
//     type: 'date',
//     date: { start: '2023-06-30', end: null, time_zone: null }
//   },
//   Picture: {
//     id: 'J%3AIm',
//     type: 'url',
//     url: 'https://s.gravatar.com/avatar/ce46a6538207dacded567a00fceeeecc?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2F87.png'
//   },
//   'Paid Expiration': {
//     id: 'Pdqy',
//     type: 'date',
//     date: { start: '2023-06-30', end: null, time_zone: null }
//   },
//   'Email Verified': { id: 'Q%3F%3Ed', type: 'checkbox', checkbox: true },
//   'User Id': { id: 'V%3D~Q', type: 'rich_text', rich_text: [ [Object] ] },
//   'Created At': {
//     id: '%5Dogk',
//     type: 'date',
//     date: { start: '2023-05-25', end: null, time_zone: null }
//   },
//   'Last Login': {
//     id: '%5Dx%3F~',
//     type: 'date',
//     date: { start: '2023-05-25', end: null, time_zone: null }
//   },
//   'Logins Count': { id: 'a%40Yd', type: 'number', number: 1 },
//   Email: { id: 'yl%40Y', type: 'email', email: '870058418@qq.com' },
//   Name: { id: 'title', type: 'title', title: [ [Object] ] }
// }
// {
//   'Last IP': { id: 'Dyv%3B', type: 'rich_text', rich_text: [] },
//   'Free Expiration': { id: 'EmTC', type: 'date', date: null },
//   Picture: { id: 'J%3AIm', type: 'url', url: null },
//   'Paid Expiration': { id: 'Pdqy', type: 'date', date: null },
//   'Email Verified': { id: 'Q%3F%3Ed', type: 'checkbox', checkbox: false },
//   'User Id': { id: 'V%3D~Q', type: 'rich_text', rich_text: [] },
//   'Created At': { id: '%5Dogk', type: 'date', date: null },
//   'Last Login': { id: '%5Dx%3F~', type: 'date', date: null },
//   'Logins Count': { id: 'a%40Yd', type: 'number', number: null },
//   Email: { id: 'yl%40Y', type: 'email', email: null },
//   Name: { id: 'title', type: 'title', title: [] }
// }