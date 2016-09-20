import bookshelf from 'bookshelf';
import knex from 'knex';
import config from '../../config/server.config';

const dbConfig = {
  client: config.dbClient,
  connection: config.connection
};

// Knex instance
const db = knex(dbConfig);

export default db;
