import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  AfterInsert,
  AfterRemove,
  getManager,
  JoinColumn,
} from 'typeorm';
import { Post } from './post.entity';
import { User } from 'src/user/entities/user.entity';
import { CommentImg } from './comment-img.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  // 这段代码建立了 Comment 与 Post 之间的多对一关联关系，并设置了当一个 Post 被删除时，所有关联的 Comment 记录也会被自动删除。这是通过数据库层面的级联删除操作实现的，不需要在应用层编写额外的代码来手动删除这些评论。
  post: Post;

  @ManyToOne(() => Comment, (comment) => comment.children)
  parent_comment: Comment;

  @OneToMany(() => Comment, (comment) => comment.parent_comment)
  children: Comment[];

  @Column({ default: 0 })
  favour_count: number;

  @ManyToMany(() => User)
  @JoinTable()
  favour_by: User[];

  @OneToMany(() => CommentImg, (image) => image.comment)
  imgs: CommentImg[]; // 添加这个字段来存储与评论相关联的图片

  @AfterInsert()
  async incrementPostCommentsCount() {
    await this.updatePostCommentsCount(1);
  }

  @AfterRemove()
  async decrementPostCommentsCount() {
    await this.updatePostCommentsCount(-1);
  }

  private async updatePostCommentsCount(increment: number) {
    const entityManager = getManager(); // 获取EntityManager
    await entityManager.increment(
      Post,
      { id: this.post.id },
      'comment_count',
      increment,
    );
  }
}
