import { DataSource, DataSourceOptions } from 'typeorm';
import {
  runSeeders,
} from 'typeorm-extension';
import configDataSourceOptions from '../../../typeOrm.config';

////////// USER
import { User } from '../../api/user/entities/user.entity';
import UserSeeder from '../seeds/user.seeder';
import UserFactory from '../factories/user.factory';
////////// USER

const onRunUserSeeds = async () => {
  console.log({configDataSourceOptions});
  const dataSource = new DataSource(configDataSourceOptions);

  await dataSource.initialize();
  await runSeeders(dataSource, {
    seeds: ['./*.seeder.ts'],
    factories: ['./*.factory.ts']
  });
}

// seeds: ['src/database/seeds/*{.ts,.js}'],
// factories: ['src/database/factories/*{.ts,.js}']




(async () => {
  console.log({configDataSourceOptions});
  // await dropADatabase();
  // await createNewDatabase();
  await onRunUserSeeds();
})();
