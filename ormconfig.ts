export default {
    "type": "mysql",
    "host": process.env.DB_HOST,
    "port": process.env.DB_PORT,
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "synchronize": false,
    "logging": process.env.APP_ENV === 'local',
    "entities": [
        "./src/entities/*.ts"
    ],
    "migrations": [
        "./src/migrations/*.ts"
    ],
    "subscribers": [
        "src/subscribers/**/*.ts"
    ],
    "cli": {
        "entitiesDir": "src/entities",
        "migrationsDir": "src/migrations",
        "subscribersDir": "src/subscribers"
    }
}
