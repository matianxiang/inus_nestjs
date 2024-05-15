import { Injectable } from '@nestjs/common';
import { Follow } from './entities/follow.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // 检查关注是否已存在
  async followExists(
    follower_id: number,
    following_id: number,
  ): Promise<boolean> {
    const count = await this.followRepository.count({
      where: { follower_id, following_id },
    });
    return count > 0;
  }

  // 获取关注数排名前 size 的用户，考虑并列情况
  async getTopFollowingUsers(size: number): Promise<User[]> {
    return this.userRepository
      .query(
        `
      SELECT u.*, COUNT(f.follower_id) as following_count
      FROM Users u
      LEFT JOIN Follows f ON u.user_id = f.following_id
      GROUP BY u.user_id
      ORDER BY following_count DESC, u.user_id
    `,
      )
      .then((users) => {
        if (users.length <= size) return users;
        const minCount = users[size - 1].following_count;
        return users.filter((user) => user.following_count >= minCount);
      });
  }

  // 获取用户的关注列表
  async getUserFollowings(userId: number): Promise<User[]> {
    return this.followRepository
      .find({
        where: { follower_id: userId },
        relations: ['following'],
      })
      .then((follows) => follows.map((follow) => follow.following));
  }

  // 获取关注该用户的用户列表
  async getUserFollowers(userId: number): Promise<User[]> {
    return this.followRepository
      .find({
        where: { following_id: userId },
        relations: ['follower'],
      })
      .then((follows) => follows.map((follow) => follow.follower));
  }

  async addFollow(follower_id: number, following_id: number): Promise<void> {
    const follow = this.followRepository.create({ follower_id, following_id });
    await this.followRepository.save(follow);
    await this.userRepository.increment(
      { user_id: follower_id },
      'following_count',
      1,
    );
    await this.userRepository.increment(
      { user_id: following_id },
      'follower_count',
      1,
    );
  }

  async removeFollow(follower_id: number, following_id: number): Promise<void> {
    await this.followRepository.delete({ follower_id, following_id });
    await this.userRepository.decrement(
      { user_id: follower_id },
      'following_count',
      1,
    );
    await this.userRepository.decrement(
      { user_id: following_id },
      'follower_count',
      1,
    );
  }

  // 获取当前表中记录数
  async count(): Promise<number> {
    return await this.followRepository.count();
  }

  // 方法来生成和插入随机关注记录
  async generateMockFollows(): Promise<void> {
    const uniquePairs = new Set<string>();
    while (uniquePairs.size < 200) {
      const followerId = Math.floor(Math.random() * 99) + 1; // 随机生成0到100的followerId
      const followingId = Math.floor(Math.random() * 99) + 1; // 随机生成0到100的followingId

      // 确保没有用户关注自己以及避免重复的关注对
      if (followerId !== followingId) {
        const pair = `${followerId}-${followingId}`;
        uniquePairs.add(pair);
      }
    }

    // 遍历集合并插入每个唯一的关注对
    for (const pair of uniquePairs) {
      const [followerId, followingId] = pair.split('-').map(Number);
      const follow = this.followRepository.create({
        follower_id: followerId,
        following_id: followingId,
      });
      await this.followRepository.save(follow);
    }
  }

  // 清空当前follow表记录
  async clearFollows(): Promise<void> {
    await this.followRepository.clear();
  }
}
