import assert from 'assert';
import {SQLQuery} from '@moped/sql';
import loadRaw from './database-connection';

export default function load(tables) {
  Object.keys(tables).forEach(tableName => {
    assert(tables[tableName] instanceof SQLQuery);
  });
  const db = loadRaw(tables);
  return async query => {
    assert(query instanceof SQLQuery);
    return db(query);
  };
}
