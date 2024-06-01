import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Post } from './entities/post.entity';
import { Comment } from './entities/comment.entity';
import { Img } from './entities/img.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Post, Comment, Img])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
