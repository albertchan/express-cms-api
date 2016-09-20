import Promise from 'bluebird';
import db from '../db';

export function getDatabaseVersion() {
  return db.schema.hasTable('schema_migrations').then(exists => {
    if (exists) {
      return db('schema_migrations')
        .first('version')
        .then(row => {
          // console.log('version', row);
        });
    }
    return Promise.reject(new Error('Database not populated'));
  });
}

export function setDatabaseVersion(transaction, version) {
  return (transaction || db)('schema_migrations')
    .insert({
      version: version,
      created_at: Date.now()
    });
}
