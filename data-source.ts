import { DataSource } from 'typeorm';
import { User } from './src/user/user.entity';
import { Product } from 'src/product/product.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'Rozzey#5',
  database: 'test',
  entities: [User, Product],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
