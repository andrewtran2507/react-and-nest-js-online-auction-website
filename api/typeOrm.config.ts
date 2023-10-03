import { DataSource, DataSourceOptions } from 'typeorm';
import { configServiceNew } from './src/common/config/config.service';
import { User } from './src/api/user/entities/user.entity';
import { Auctions } from './src/api/auctions/entities/auction.entity';
import { Bid } from './src/api/bid/entities/bid.entity';
import { Deposit } from './src/api/deposit/entities/deposit.entity';
import { Role } from './src/api/role/entities/role.entity';

// import PostEntity from './src/api/post/post.entity';

console.log("POSTGRES CONFIG",  {
  type: 'postgres',
  host: configServiceNew.get('POSTGRES_HOST'),
  port: parseInt(configServiceNew.get('POSTGRES_PORT')),
  username: configServiceNew.get('POSTGRES_USER'),
  password: configServiceNew.get('POSTGRES_PASSWORD'),
  database: configServiceNew.get('POSTGRES_DB'),
  logging: 'all',
});
const configDataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: configServiceNew.get('POSTGRES_HOST'),
  port: parseInt(configServiceNew.get('POSTGRES_PORT')),
  username: configServiceNew.get('POSTGRES_USER'),
  password: configServiceNew.get('POSTGRES_PASSWORD'),
  database: configServiceNew.get('POSTGRES_DB'),
  logging: 'all',
  synchronize: true,
  entities: [
    User,
    Role,
    Auctions,
    Bid,
    Deposit,
  ],
  // entities: ['./src/api/**/*.entity{.ts,.js}'],
  // entities: ['./src/**/*.entity{.ts,.js}'],
  // migrations: ['./migrations/**/*{.ts,.js}'],
  // subscribers: ['subscriber/**/*.js']
};

export const dataSource = new DataSource(configDataSourceOptions);
export default configDataSourceOptions;
