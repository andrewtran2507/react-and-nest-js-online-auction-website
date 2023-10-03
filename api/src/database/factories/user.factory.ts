import { setSeederFactory } from 'typeorm-extension';
import { User } from '../../api/user/entities/user.entity';

export default setSeederFactory(User, (faker) => {
    const user = new User();

    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const email = faker.internet.email();
    const password = faker.internet.password();


    user.name = `${firstName} ${lastName}`;
    user.password = password;
    user.email = email;

    console.log({user});
    return user;
})
