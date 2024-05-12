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

  findAll(page: number, limit: number): Promise<User[]> {
    return this.userRepository.find({
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  count(): Promise<number> {
    return this.userRepository.count();
  }

  findOneById(user_id: number): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { user_id } });
  }
}
