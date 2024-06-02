import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  // AfterInsert,
  // AfterRemove,
  // getRepository,
} from 'typeorm';

import { User } from 'src/user/entities/user.entity';
import { Comment } from './comment.entity';
import { PostImg } from './post-img.entity';

@Entity('Posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  user_id: number;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' }) //多对一 多个Post可能对应一个User
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 255, charset: 'utf8mb4' })
  title: string;

  @Column({ type: 'text', charset: 'utf8mb4' })
  content: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'int', default: 0 })
  favour_count: number;

  @ManyToMany(() => User)
  @JoinTable()
  favour_by: User[];

  @Column({ type: 'int', default: 0 })
  comment_count: number;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @Column({ type: 'int', default: 0 })
  star_count: number;

  @ManyToMany(() => User)
  @JoinTable()
  star_by: User[];

  @Column({ type: 'int', default: 0 })
  share_count: number;

  @OneToMany(() => PostImg, (img) => img.post, {
    cascade: ['insert', 'update', 'remove'],
    // insert: 如果在保存主实体时关联实体是新创建的（即未在数据库中存在），则自动保存这些新的关联实体。
    // update: 如果关联实体在加载后被修改，当保存主实体时也会自动保存这些更改。
    // remove: 如果从关联数组中移除了某些实体，保存主实体时也会从数据库中删除这些实体。
    // 这意味着当你保存、更新或删除一个 Post 实体时，与之关联的 PostImg 实体也会根据上述规则自动进行插入、更新或删除操作。
    eager: true, // eager 选项用于控制关联实体的加载方式。在 TypeORM 中，关联可以是 eager（急切加载）或 lazy（懒加载
  })
  imgs: PostImg[];

  // hooks 自动更新user的post_count
  // @AfterInsert()
  // async increasePostCount() {
  //   const userRepository = getRepository(User);
  //   await userRepository.increment({ user_id: this.user_id }, 'post_count', 1);
  // }

  // @AfterRemove()
  // async decreasePostCount() {
  //   const userRepository = getRepository(User);
  //   await userRepository.decrement({ user_id: this.user_id }, 'post_count', 1);
  // }
}
