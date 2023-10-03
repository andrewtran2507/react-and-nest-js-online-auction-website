import { dropDatabase, } from 'typeorm-extension';
import configDataSourceOptions from '../../../typeOrm.config';

const dropADatabase = async () => {
  await dropDatabase({
    options: configDataSourceOptions
  });
}

(async () => {
  await dropADatabase();
})();
