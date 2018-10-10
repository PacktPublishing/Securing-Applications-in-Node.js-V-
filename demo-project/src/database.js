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
  RateLimitState: sql`
    CREATE TABLE RateLimitState (
      id TEXT NOT NULL PRIMARY KEY,
      state TEXT NOT NULL
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
  async updatePassword(username, password) {
    await query(
      sql`
        UPDATE Users
          SET password = ${password}
          WHERE username = ${username}
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

export const rateLimit = prefix => ({
  async save(id, state) {
    if (await this.load(id)) {
      await query(
        sql`
          UPDATE RateLimitState
            SET state = ${JSON.stringify(state)}
            WHERE id = ${prefix + ':' + id}
        `,
      );
    } else {
      await query(
        sql`
          INSERT INTO RateLimitState (id, state)
            VALUES (${prefix + ':' + id}, ${JSON.stringify(state)})
        `,
      );
    }
  },
  async load(id) {
    const records = await query(
      sql`
        SELECT state FROM RateLimitState
          WHERE id = ${prefix + ':' + id}
      `,
    );
    return records.length ? JSON.parse(records[0].state) : null;
  },
  async remove(id) {
    await query(
      sql`
        DELETE FROM RateLimitState
          WHERE id = ${prefix + ':' + id}
      `,
    );
  },
});
