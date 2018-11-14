import sql from '@moped/sql';
import cuid from 'cuid';
import loadDatabase from './safe-database';

const query = loadDatabase({
  Users: sql`
    CREATE TABLE Users (
      username TEXT NOT NULL PRIMARY KEY,
      twoFactorSecret TEXT NULL
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
  Tokens: sql`
    CREATE TABLE Tokens (
      id TEXT NOT NULL PRIMARY KEY,
      token TEXT NOT NULL
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
  async create(username) {
    await query(
      sql`
        INSERT INTO Users (username)
          VALUES (${username})
      `,
    );
  },
  async updateTwoFactorSecret(username, twoFactorSecret) {
    if (await users.get(username)) {
      await query(
        sql`
          UPDATE Users
            SET twoFactorSecret = ${twoFactorSecret}
            WHERE username = ${username}
        `,
      );
    } else {
      await query(
        sql`
          INSERT INTO Users (username, twoFactorSecret)
            VALUES (${username}, ${twoFactorSecret})
        `,
      );
    }
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

export const tokens = {
  async save(token) {
    const id = cuid();
    await query(
      sql`
        INSERT INTO Tokens (id, token)
          VALUES (${id}, ${JSON.stringify(token)})
      `,
    );
    return id;
  },
  async load(tokenID) {
    const records = await query(
      sql`
        SELECT token FROM Tokens
          WHERE id = ${tokenID}
      `,
    );
    return records.length ? JSON.parse(records[0].token) : null;
  },
  async update(tokenID, token) {
    await query(
      sql`
        UPDATE Tokens
          SET token = ${JSON.stringify(token)}
          WHERE id = ${tokenID}
      `,
    );
  },
  async remove(tokenID) {
    await query(
      sql`
        DELETE FROM Tokens
          WHERE id = ${tokenID}
      `,
    );
  },
};
