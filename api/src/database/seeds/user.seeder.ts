import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from '../../api/user/entities/user.entity';

export default class UserSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager
    ): Promise<any> {
        const repository = dataSource.getRepository(User);
        await repository.insert([
            {
                name: 'Caleb Barrows',
                password: '123123$3T',
                email: 'caleb.barrows@gmail.com'
            }
        ]);

        // ---------------------------------------------------

        const userFactory = await factoryManager.get(User);
        // save 1 factory generated entity, to the database
        await userFactory.save();

        // save 5 factory generated entities, to the database
        await userFactory.saveMany(5);
    }
}
