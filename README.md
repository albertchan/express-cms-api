# express-cms-api

## API Endpoints

Authentication endpoints:

```
POST  /api/v1/login
GET   /api/v1/logout
```

CRUD operations for users and posts:

```
GET     /api/v1/posts
POST    /api/v1/new-post
GET     /api/v1/posts/:id
PUT     /api/v1/posts/:id
DELETE  /api/v1/posts/:id
GET     /api/v1/posts/slug/:id
PUT     /api/v1/posts/slug/:id
DELETE  /api/v1/posts/slug/:id
```

## Getting started

```
# Install dependencies
npm install

# Serve in development mode
npm run development

# Build for production
npm run build-server

# Server in production mode
npm run prod-server
```

## Database setup and migrations

```
CREATE DATABASE "express_cms_dev";
CREATE USER express WITH PASSWORD 'verysecret';
ALTER ROLE express SET client_encoding TO 'utf8';
GRANT ALL PRIVILEGES ON DATABASE "express_cms_dev" TO express;
\q
```

## Knex CLI

Running `knex-cli` commands from within the project root:

```
./node_modules/.bin/knex <command>
```

## ES7

To use proposed JS features not included into ES6, do this:

* `npm install --save-dev babel-preset-stage-0`
* in `brunch-config.js`, add the preset: `presets: ['es2015', 'stage-0']`
