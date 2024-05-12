import { Gender } from 'src/enums';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('Users')
export class User {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  user_id: number;

  @Column({ type: 'varchar', length: 50, default: 'momo' })
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

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar_url: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'varchar', length: 15, default: '12345678999' })
  phone_number: string;

  @Column({ type: 'int', default: 0, comment: '我关注的人' })
  follower_count: number;

  @Column({ type: 'int', default: 0, comment: '关注我的人' })
  following_count: number;

  @Column({ type: 'int', default: 0 })
  favour_count: number;

  @Column({ type: 'int', default: 0 })
  star_count: number;

  @Column({ type: 'int', default: 0 })
  post_count: number;

  @Column({ type: 'int', default: 0 })
  video_count: number;

  @Column({ type: 'varchar', length: 100, default: '上海' })
  address: string;
}
