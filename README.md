# Facebook clone API

## Required software

1. MySQL for local environment
2. SQLite for test environment
3. Node v16

## Installation

1. Run `npm install -g crypto`
2. Run `node`, and inside it run `require('crypto').randomBytes(64).toString('hex')` and use it for `TOKEN_SECRET` in .env
3. Configure your environment variables: `cp .env.example .env`

## Syncing migrations

1. When you create a new entity or change an existing entity, you should generate a migration file: `yarn migration:generate --name=<migration_name>`
2. Synchronize your changes to your local database: `yarn migration:run`
