const {Client} = require("@notionhq/client");

class NotionManager {
  constructor(props) {
    this.notion = new Client({
      auth: props.auth,
    })
  }
  
  async postCRMUserInfoFromAuth0Data(user) {
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
              start: user.created_at.split('.')[0] + 'Z',
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
              start: user.last_login.split('.')[0] + 'Z',
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
  
  async getUserInfoFromNotion(user) {
    // query database for user
    // if user exists, return user
    // else return null
    const res = await this.notion.databases.query({
      database_id: '77414699b6864b6986c53c18457731d3',
      filter: {
        and: [
          {
            property: 'User Id',
            rich_text: {
              equals: user.user_id,
            },
          }
        ]
      }
    });
    if (res.results.length === 0) {
      return null;
    }
    return res.results[0];
  }
  
  async updateNotionUserInfoFromAuth0(page_id, user) {
    try {
      await this.notion.pages.update({
        page_id: page_id,
        properties: {
          'Email Verified': {
            id: 'Q%3F%3Ed',
            type: 'checkbox',
            checkbox: user.email_verified,
          },
          'Last Login': {
            id: '%5Dx%3F~',
            type: 'date',
            date: {
              start: user.last_login.split('.')[0] + 'Z',
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
        }
      });
    } catch (e) {
      console.log("Error! Entry not updated:", user.user_id)
    }
  }
  
  async updateCRMUserMetadata(page_id, freeExpiration, paidExpiration) {
    try {
      await this.notion.pages.update({
        page_id: page_id,
        properties: {
          'Free Expiration': {
            id: 'EmTC',
            type: 'date',
            date: {
              start: freeExpiration.split('.')[0] + 'Z',
            },
          },
          'Paid Expiration': {
            id: 'Pdqy',
            type: 'date',
            date: {
              start: paidExpiration.split('.')[0] + 'Z',
            },
          }
        }
      })
    } catch (e) {
      console.log("update error")
    }
  }
  
  async getAllCRMUsers() {
    let users = [];
    let next_cursor = undefined;
    while (true) {
      const res = await this.notion.databases.query({
        database_id: '77414699b6864b6986c53c18457731d3',
        start_cursor: next_cursor,
      });
      users = users.concat(res.results);
      if (!res.has_more) {
        break;
      }
      next_cursor = res.next_cursor;
    }
    return users;
  }
  
  async getAllCDKeys() {
    let cdKeys = [];
    let next_cursor = undefined;
    while (true) {
      const res = await this.notion.databases.query({
        database_id: 'f7ea157a0b374ab8aede38c2636756db',
        start_cursor: next_cursor,
      });
      cdKeys = cdKeys.concat(res.results);
      if (!res.has_more) {
        break;
      }
      next_cursor = res.next_cursor;
    }
    return cdKeys;
  }
  
  async getCDKeyFromNotion(cdKey) {
    try {
      const res = await this.notion.databases.query({
        database_id: 'f7ea157a0b374ab8aede38c2636756db',
        filter: {
          and: [
            {
              property: 'Name',
              title: {
                equals: cdKey.SK,
              },
            }
          ]
        }
      })
      if (res.results.length === 0) {
        return null;
      } else {
        return res.results[0];
      }
    } catch (e) {
      console.log("Error! Entry not found:", cdKey.SK);
    }
  }
  
  async postCDKeysByDDB(cdKey) {
    try {
      await this.notion.pages.create({
        parent: {
          type: "database_id",
          database_id: 'f7ea157a0b374ab8aede38c2636756db',
        },
        properties: {
          Name: {
            id: 'title',
            type: 'title',
            title: [
              {
                type: 'text',
                text: {
                  content: cdKey.SK,
                },
                plain_text: cdKey.SK,
              }
            ]
          },
          Key: {
            id: 'u%3A%7DW',
            type: 'rich_text',
            rich_text: [
              {
                type: 'text',
                text: {
                  content: cdKey.SK,
                },
                plain_text: cdKey.SK,
              }
            ]
          },
          Updated: {
            id: 'TuDs',
            type: 'date',
            date: {
              start: new Date((cdKey?.updated || cdKey?.created || 0) * 1000).toISOString().split('.')[0] + 'Z',
            }
          },
          Created: {
            id: 'VZfr',
            type: 'date',
            date: {
              start: new Date((cdKey?.created || 0) * 1000).toISOString().split('.')[0] + 'Z',
            }
          },
          Quantity: {
            id: 'q~%3B%7B',
            type: 'number',
            number: cdKey?.quantity || 0,
          },
          'User Id': {
            id: 'qjF%7B',
            type: 'rich_text',
            rich_text: [
              {
                type: 'text',
                text: {
                  content: cdKey?.user_id || '',
                },
                plain_text: cdKey?.user_id || '',
              }
            ]
          },
          Used: {
            id: 'byb%60',
            type: 'checkbox',
            checkbox: cdKey?.used || false,
          }
        },
      });
    } catch (e) {
      console.error("Error! Entry not added:", e);
    }
  }
  
  async updateCDKeysByDDB(page_id, cdKey) {
    try {
      await this.notion.pages.update({
        page_id: page_id,
        properties: {
          Updated: {
            id: 'TuDs',
            type: 'date',
            date: {
              start: new Date((cdKey?.updated || cdKey?.created || 0) * 1000).toISOString().split('.')[0] + 'Z',
            }
          },
          'User Id': {
            id: 'qjF%7B',
            type: 'rich_text',
            rich_text: [
              {
                type: 'text',
                text: {
                  content: cdKey?.user_id || '',
                },
                plain_text: cdKey?.user_id || '',
              }
            ]
          },
          Used: {
            id: 'byb%60',
            type: 'checkbox',
            checkbox: cdKey?.used || false,
          }
        }
      })
    } catch (e) {
      console.error("Error! Entry not updated:", e);
    }
  }
}

module.exports = NotionManager;
