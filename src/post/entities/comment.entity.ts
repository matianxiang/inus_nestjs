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

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  // 这段代码建立了 Comment 与 Post 之间的多对一关联关系，并设置了当一个 Post 被删除时，所有关联的 Comment 记录也会被自动删除。这是通过数据库层面的级联删除操作实现的，不需要在应用层编写额外的代码来手动删除这些评论。
  post: Post;

  @ManyToOne(() => Comment, (comment) => comment.children)
  parentComment: Comment;

  @OneToMany(() => Comment, (comment) => comment.parentComment)
  children: Comment[];

  @Column({ default: 0 })
  likes: number;

  @ManyToMany(() => User)
  @JoinTable()
  likedBy: User[];

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
      'commentsCount',
      increment,
    );
  }
}
