import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(userData: Partial<User>): Promise<User> {
    const newUser = this.userRepository.create(userData);
    return this.userRepository.save(newUser);
  }

  async updateUser(user_id: number, updateData: Partial<User>): Promise<User> {
    const user = await this.userRepository.findOneBy({ user_id });
    if (!user) {
      throw new Error('User not found');
    }
    Object.assign(user, updateData);
    return this.userRepository.save(user);
  }

  async deleteUser(user_id: number): Promise<void> {
    const result = await this.userRepository.delete(user_id);
    if (result.affected === 0) {
      throw new Error('User not found');
    }
  }

  async deleteMultipleUsers(userIds: number[]): Promise<void> {
    const result = await this.userRepository.delete(userIds);
    if (result.affected === 0) {
      throw new Error('No users found');
    }
  }

  findOneById(user_id: number): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { user_id } });
  }

  findAll(page: number, limit: number): Promise<User[]> {
    return this.userRepository.find({
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  count(): Promise<number> {
    return this.userRepository.count();
  }
}
