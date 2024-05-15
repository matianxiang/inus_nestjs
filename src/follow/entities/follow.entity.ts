import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Check,
} from 'typeorm';

@Entity('Follows')
@Check(`"follower_id" != "following_id"`)
export class Follow {
  @PrimaryColumn()
  follower_id: number;

  @PrimaryColumn()
  following_id: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'follower_id' })
  follower: User;
  // 多个 Follow 记录可以有相同的 follower_id，因为一个用户（关注者）可以关注多个其他用户。因此，对于 follower_id 字段，Follow 到 User 的关系是多对一——多个关注记录指向单一的用户实体。

  @ManyToOne(() => User)
  @JoinColumn({ name: 'following_id' })
  following: User;
  // 多个 Follow 记录可以有相同的 following_id，因为一个用户（被关注者）可以被多个其他用户关注。所以，这里也是多对一的关系——多个关注记录指向单一的用户实体。
}
