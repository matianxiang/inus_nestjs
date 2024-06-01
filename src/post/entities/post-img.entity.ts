import {
  Entity,
  ManyToOne,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Post } from './post.entity';
import { User } from 'src/user/entities/user.entity';
import { Img } from 'src/upload/entities/img.entity';

@Entity('PostImgs')
export class PostImg {
  @PrimaryColumn({ type: 'string' })
  img_id: string;

  @OneToOne(() => Img, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'img_id' })
  img: Img;

  @ManyToOne(() => Post, (post) => post.imgs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  // @JoinColumn({ name: 'post_id' }): 这个装饰器用来明确指出 PostImg 实体中用于存储与 Post 实体关联的外键的列名是 post_id。这意味着在数据库中 PostImg 表会有一个名为 post_id 的列，用来存储它所关联的 Post 实体的 id 值。
  post: Post;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
