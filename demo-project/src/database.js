import sql from '@moped/sql';
import loadDatabase from './safe-database';

const query = loadDatabase({
  Users: sql`
    CREATE TABLE Users (
      username TEXT NOT NULL PRIMARY KEY,
      password TEXT NOT NULL
    )
  `,
  Posts: sql`
    CREATE TABLE Posts (
      id BIGSERIAL NOT NULL PRIMARY KEY,
      authorUsername TEXT NOT NULL,
      body TEXT NOT NULL
    )
  `,
});

export const users = {
  async get(username) {
    const results = await query(
      sql`SELECT * FROM Users WHERE username = ${username}`,
    );
    return results[0];
  },
  async create(username, password) {
    await query(
      sql`
        INSERT INTO Users (username, password)
          VALUES (${username}, ${password})
      `,
    );
  },
};

export const posts = {
  async list() {
    const results = await query(sql`SELECT * FROM Posts`);
    return results;
  },
  async create(authorUsername, body) {
    await query(
      sql`
        INSERT INTO Posts (body, authorUsername)
          VALUES (${body}, ${authorUsername})
      `,
    );
  },
};
