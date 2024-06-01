import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { faker } from '@faker-js/faker';
import { Post } from 'src/post/entities/post.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async mockUser(): Promise<void> {
    for (let i = 0; i < 100; i++) {
      const user = new User();
      user.user_id = i + 1;
      user.username = faker.person.fullName();
      user.password = faker.internet.password();
      user.email = faker.internet.email();
      user.gender = faker.number.int({ min: 0, max: 2 });
      user.avatar_url = faker.image.avatar();
      user.created_at = faker.date.recent();
      user.phone_number = faker.string.numeric(11);
      user.address = faker.location.city();
      await this.userRepository.save(user); // 保存用户到数据库
    }
  }

  async clearUsers(): Promise<void> {
    return this.userRepository.clear();
  }

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
    const result = await this.userRepository.delete({ user_id });
    if (result.affected === 0) {
      throw new Error('User not found');
    }
  }

  async deleteMultipleUsers(user_ids: number[]): Promise<void> {
    const result = await this.userRepository.delete(user_ids);
    if (result.affected === 0) {
      throw new Error('No users found');
    }
  }

  async findAll(page: number, limit: number): Promise<User[]> {
    return this.userRepository.find({
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findOneById(user_id: number): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { user_id } });
  }

  async findUsersByUsername(username: string): Promise<User[]> {
    console.log('username', username);
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.username like :username', { username: `%${username}%` })
      .orderBy(
        `CASE WHEN user.username = :username THEN 0 ELSE 1 END, LENGTH(user.username)`,
        'ASC',
      )
      .cache(60000) // 1 min
      .getMany();
  }

  async findUsersByUsernameSortedByCreatedAt(
    username: string,
  ): Promise<User[]> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.username LIKE :username', { username: `%${username}%` })
      .orderBy('user.created_at', 'DESC')
      .getMany();
  }

  async findUsersByUsernameSortedByFollowingCount(
    username: string,
  ): Promise<User[]> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.username LIKE :username', { username: `%${username}%` })
      .orderBy('user.following_count', 'DESC')
      .getMany();
  }

  count(): Promise<number> {
    return this.userRepository.count();
  }

  async getPosts(user_id: number): Promise<Post[]> {
    return this.postRepository.find({
      where: { user_id: user_id },
      order: { created_at: 'DESC' },
      relations: ['comments', 'imgs'], // 需要查全
    });
  }

  async getFavourPosts(user_id: number): Promise<Post[]> {
    const user = await this.userRepository.findOne({ where: { user_id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.favour_post_ids.length === 0) {
      return [];
    }

    return this.postRepository.find({
      where: { id: In(user.favour_post_ids) },
    });
  }

  async getStarPosts(user_id: number): Promise<Post[]> {
    const user = await this.userRepository.findOne({ where: { user_id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.star_post_ids.length === 0) {
      return [];
    }

    return this.postRepository.find({
      where: { id: In(user.star_post_ids) },
    });
  }

  async updateIntroduction(
    user_id: number,
    introduction: string,
  ): Promise<void> {
    await this.userRepository.update(user_id, { introduction });
  }

  async updateTags(user_id: number, tags: string[]): Promise<void> {
    await this.userRepository.update(user_id, { tags });
  }

  async updateOfficialCertification(
    user_id: number,
    officialCertification: boolean,
  ): Promise<void> {
    await this.userRepository.update(user_id, {
      official_certification: officialCertification,
    });
  }
}
