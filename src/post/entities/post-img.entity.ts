import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Post } from './post.entity';
import { User } from 'src/user/entities/user.entity';

@Entity('PostImgs')
export class PostImg {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  height: number;

  @Column({ type: 'int' })
  width: number;

  @Column({ type: 'int' })
  size: number;

  @Column({ type: 'varchar' })
  url: string;

  @ManyToOne(() => Post, (post) => post.imgs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  // @JoinColumn({ name: 'post_id' }): 这个装饰器用来明确指出 PostImg 实体中用于存储与 Post 实体关联的外键的列名是 post_id。这意味着在数据库中 PostImg 表会有一个名为 post_id 的列，用来存储它所关联的 Post 实体的 id 值。
  post: Post;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
