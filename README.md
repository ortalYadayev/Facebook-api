# Facebook clone API

## Installation
1. Install globally ts-node: `yarn global add ts-node`
2. Configure your environment variables: `cp .env.example .env`

## Syncing migrations
1. When you create a new entity or change an existing entity, generate a migration file: `yarn typeorm migration:generate --name=<migration_name> --pretty`
2. Synchronize your changes to your local database: `yarn typeorm schema:sync`
