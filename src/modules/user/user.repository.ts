import { User } from '@/modules/user/user.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createAndSave(user: Partial<User>): Promise<User> {
    const existingUser = await this.findOne({ where: { email: user.email } });
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const newUser = await this.create(user);
    return await this.save(newUser);
  }

  async createAndUpdate(id: string, user: Partial<User>): Promise<User> {
    const existingUser = await this.findOne({ where: { email: user.email } });
    if (existingUser && existingUser.id !== id) {
      throw new Error('Email already in use');
    }

    const updateUser = await this.create(user);
    await this.update(id, updateUser);

    return await this.findOne(id);
  }
}
