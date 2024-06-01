import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadModule } from './upload/upload.module';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { FollowModule } from './follow/follow.module';
import { Follow } from './follow/entities/follow.entity';
import { PostModule } from './post/post.module';
import { Post } from './post/entities/post.entity';
import { PostImg } from './post/entities/post-img.entity';
import { CommentImg } from './post/entities/comment-img.entity';
import { Comment } from './post/entities/comment.entity';

@Module({
  imports: [
    UploadModule,
    UserModule,
    FollowModule,
    PostModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '121.40.144.182',
      port: 3306,
      username: 'inus',
      password: '123456',
      database: 'inus',
      logging: true, // 开启日志
      entities: [User, Follow, Post, PostImg, Comment, CommentImg], // 用于指定应用中所有数据库实体的位置。实体（Entity）是 TypeORM 用来映射数据库表到 JavaScript 或 TypeScript 类的一种机制。每一个实体类代表数据库中的一张表，类中的属性对应于表中的列。
      synchronize: true, // 控制是否允许 TypeORM 根据实体自动更新数据库结构。
    }),
  ], //将upload模块导入根模块
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
