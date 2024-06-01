import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Comment } from './comment.entity';

@Entity('CommentImgs')
export class CommentImg {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string; // 存储图片的URL或者文件路径

  @ManyToOne(() => Comment, (comment) => comment.imgs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'comment_id' })
  comment: Comment;
}
