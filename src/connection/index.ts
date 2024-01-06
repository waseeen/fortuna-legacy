import { DataSource } from 'typeorm';
import { startBot } from '../client';
import '../logs/messages';

const db = new DataSource({
  type: process.env.MYSQL_TYPE as 'mysql',
  host: process.env.MYSQL_HOST,
  port: <number>(<unknown>process.env.MYSQL_PORT),
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  charset: process.env.MYSQL_CHARSET,
  synchronize: true,
  logging: false,
  entities: [__dirname + '/../database/**.entity.*'],
});

db.initialize().then(() => {
  console.log('Database ready');
  startBot();
});

export default db;
