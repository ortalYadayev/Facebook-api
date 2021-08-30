# Facebook clone API

## Required software

1. MySQL for local environment
2. SQLite for test environment
3. Node v16

## Installation

1. Configure your environment variables: `cp .env.example .env`

## Syncing migrations

1. When you create a new entity or change an existing entity, you should generate a migration file: `yarn migration:generate --name=<migration_name>`
2. Synchronize your changes to your local database: `yarn migration:run`
