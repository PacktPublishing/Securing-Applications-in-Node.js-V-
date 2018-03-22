// This file implements a crude database on top of json
// in a real production app you would use something like
// postgres or mysql in place of this adapter.

import {readFileSync, writeFileSync, mkdirSync} from 'fs';
import alasql from 'alasql';

export default function load(tables) {
  const db = new alasql.Database();
  function exec(query, params) {
    if (
      typeof query !== 'string' &&
      typeof query.text === 'string' &&
      Array.isArray(query.values)
    ) {
      return db.exec(query.text.replace(/\$\d/g, '?'), query.values);
    }
    return db.exec(query, params);
  }
  const tableNames = Object.keys(tables);
  tableNames.forEach(tableName => {
    exec(tables[tableName]);
  });

  const dataDirectory = __dirname + '/../data';
  const file = tableName => `${dataDirectory}/${tableName}.json`;
  try {
    mkdirSync(dataDirectory);
    tableNames.forEach(tableName => {
      writeFileSync(file(tableName), '[]');
    });
  } catch (ex) {
    if (ex.code !== 'EEXIST') {
      throw ex;
    }

    tableNames.forEach(tableName => {
      try {
        JSON.parse(readFileSync(file(tableName), 'utf8')).forEach(record => {
          exec(`INSERT INTO ${tableName} ?`, [record]);
        });
      } catch (ex) {
        if (ex.code !== 'ENOENT') {
          throw ex;
        }
        writeFileSync(file(tableName), '[]\n');
      }
    });
  }

  return async function runQuery(query, params) {
    console.log('exec: ' + (typeof query === 'string' ? query : query.text));
    if (typeof query !== 'string') {
      console.log(query.values);
    }
    const result = exec(query, params);
    tableNames.forEach(tableName => {
      writeFileSync(
        file(tableName),
        JSON.stringify(exec(`SELECT * FROM ${tableName}`), null, '  '),
      );
    });
    return result;
  };
}
