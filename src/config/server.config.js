/*
 * Express configuration
 */

const projectRoot = process.cwd();
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  // let config = new Map();
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 3001,

  // The path at which static assets are served from. If omitted, Express will
  // serve any static assets from your project root 'static' directory.
  //
  // Expects: String
  staticPath: projectRoot + '/public',

  // Compression
  gzipEnabled: true,
  gzipThreshold: 200,

  // Database configuration
  //
  // dbClient expects a string, currently only 'pg' (PostgresSQL) is supported
  // connection expects a configuration object for Knex.
  //
  // References:
  // Connection options http://knexjs.org/#Installation-client
  // Migrations http://knexjs.org/#Migrations
  dbClient: 'pg',
  connection: {
    host: 'localhost',
    user: 'express',
    password: 'verysecret',
    database: 'express_cms_dev',
    charset: 'utf-8'
  },

  // migrations: {
  //   tableName: 'migrations'
  // }

  // Session management
  session: {
    secret: 'S6tdqAkQbPHzQr1qSv0h6OT5yH+wvYsvbfR5xC3UhKduS/SeyS7lC1cOddtB7Tmz',
    resave: false,
    saveUninitialized: true,
    cookie: process.env === 'production' ? { secure: true } : {}
  }
};
