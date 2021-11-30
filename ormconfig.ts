import { ConnectionOptions } from 'typeorm';

let ormconfig: ConnectionOptions = {
  name: 'default',
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
  subscribers: ['src/**/*.subscriber.ts'],
  cli: {
    entitiesDir: 'src/entities',
    migrationsDir: 'src/database/migrations',
    subscribersDir: 'src/database/subscribers',
  },
  logger: 'advanced-console',
  logging: ['warn', 'error'],
  dropSchema: false,
  synchronize: false,
};

if (process.env.NODE_ENV === 'test') {
  ormconfig = {
    ...ormconfig,
    name: 'test',
    username: process.env.TEST_DB_USERNAME,
    password: process.env.TEST_DB_PASSWORD,
    database: process.env.TEST_DB_NAME,
  };
}

export default ormconfig;
