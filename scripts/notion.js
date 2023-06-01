const {Client} = require("@notionhq/client");

class NotionManager {
  constructor(props) {
    this.notion = new Client({
      auth: props.auth,
    })
  }
  async postUserToCRM(user) {
    try {
      await this.notion.pages.create({
        parent: {
          type: "database_id",
          database_id: '77414699b6864b6986c53c18457731d3',
        },
        icon: {
          type: 'external',
          external: {
            url: user.picture,
          }
        },
        properties: {
          'Created At': {
            id: '%5Dogk',
            type: 'date',
            date: {
              // created_at is in ISO 8601 format, we only need the date and hour, minute, and timezone. we do not need the seconds.
              start: user.created_at.split('T')[0],
              end: null,
              time_zone: null,
            }
          },
          'User Id': {
            id: 'V%3D~Q',
            type: 'rich_text',
            rich_text: [
              {
                type: 'text',
                text: {
                  content: user.user_id,
                },
                plain_text: user.user_id,
                href: null,
              }
            ]
          },
          Name: {
            id: 'title',
            type: 'title',
            title: [
              {
                type: 'text',
                text: {
                  content: user.username || user.email,
                },
                plain_text: user.username || user.email,
              }
            ]
          },
          Email: {
            id: 'yl%40Y',
            type: 'email',
            email: user.email,
          },
          'Email Verified': {
            id: 'Q%3F%3Ed',
            type: 'checkbox',
            checkbox: user.email_verified,
          },
          'Last Login': {
            id: '%5Dx%3F~',
            type: 'date',
            date: {
              start: user.last_login.split('T')[0],
              end: null,
              time_zone: null,
            }
          },
          'Last IP': {
            id: 'Dyv%3B',
            type: 'rich_text',
            rich_text: [
              {
                type: 'text',
                text: {
                  content: user.last_ip,
                },
                plain_text: user.last_ip,
                href: null,
              }
            ]
          },
          'Logins Count': {
            id: '40Yd',
            type: 'number',
            number: user.logins_count,
          },
          'Free Expiration': {
            id: 'EmTC',
            type: 'date',
            date: null,
          },
          'Paid Expiration': {
            id: 'Pdqy',
            type: 'date',
            date: null,
          }
        }
      });
      console.log("Success! Entry added:", user.user_id);
    } catch (e) {
      console.error("Error! Entry not added:", user.user_id, e);
    }
  }
}

export default NotionManager;