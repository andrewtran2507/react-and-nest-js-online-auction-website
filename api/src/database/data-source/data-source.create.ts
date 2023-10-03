import { DataSource } from 'typeorm';
import { createDatabase } from 'typeorm-extension';
import configDataSourceOptions from '../../../typeOrm.config';

const createNewDatabase =  async () => {
  try {
    await createDatabase({
        options: configDataSourceOptions
    });
    const dataSource = new DataSource(configDataSourceOptions);
    await dataSource.initialize();
  } catch (e) {
    throw new Error(e);
  }
}

(async () => {
  await createNewDatabase();
})();
