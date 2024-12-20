import { Gender } from 'src/enums';
import { Post } from 'src/post/entities/post.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('Users')
export class User {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  user_id: number;

  @Column({ type: 'varchar', length: 50, default: 'momo', charset: 'utf8mb4' })
  username: string;

  @Column({ type: 'varchar', length: 50 })
  password: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  email: string;

  @Column({
    type: 'int',
    default: Gender.Unknown,
  })
  gender: Gender;

  @Column({ type: 'varchar', nullable: true })
  avatar_url: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'varchar', length: 15, default: '12345678999' })
  phone_number: string;

  @Column({ type: 'int', default: 0, comment: '关注我的人' })
  follower_count: number;

  @Column({ type: 'int', default: 0, comment: '我关注的人' })
  following_count: number;

  @Column({ type: 'int', default: 0 })
  favour_count: number;

  @Column({ type: 'int', default: 0 })
  star_count: number;

  @Column({ type: 'int', default: 0 })
  post_count: number;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @Column({ type: 'int', default: 0 })
  video_count: number;

  @Column({ type: 'varchar', length: 100, default: '上海' })
  address: string;

  @Column('simple-array')
  favour_post_ids: string[];

  @Column('simple-array')
  star_post_ids: string[];

  @Column({ type: 'varchar', length: 500, nullable: true })
  introduction: string; // 个人简介，长度限制500

  @Column('simple-array')
  tags: string[]; // 标签数组

  // 是否是官方认证，默认为false
  @Column({ type: 'boolean', default: false })
  official_certification: boolean;
}
