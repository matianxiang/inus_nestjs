import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Put,
  Query,
  HttpCode,
} from '@nestjs/common';
import { PostService } from './post.service';
import { SuccessRes } from 'src/models';
import { ResBasic } from 'src/types/common';
import { Post as PostType } from './entities/post.entity';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('mock')
  @HttpCode(200)
  async mockPosts(): Promise<ResBasic<object>> {
    await this.postService.mockPosts();
    return new SuccessRes({});
  }

  @Post()
  @HttpCode(200)
  async createPost(CreatePostDto): Promise<ResBasic<PostType>> {
    const res = await this.postService.createPost(CreatePostDto);
    return new SuccessRes(res);
  }

  @Delete()
  @HttpCode(200)
  async deletePosts(@Query('ids') ids: string[]): Promise<ResBasic<object>> {
    await this.postService.deletePostsByIds(ids);
    return new SuccessRes({});
  }

  @Put(':id')
  @HttpCode(200)
  async updatePost(updatePostDto): Promise<ResBasic<PostType>> {
    const res = await this.postService.updatePost(updatePostDto);
    return new SuccessRes(res);
  }

  @Get(':id')
  @HttpCode(200)
  async getPostById(@Param('id') id: string): Promise<ResBasic<PostType>> {
    const res = await this.postService.getPostById(id);
    return new SuccessRes(res);
  }

  @Post('toggle-favour')
  @HttpCode(200)
  async toggleFavour(
    @Body('user_id') user_id: number,
    @Body('id') id: string,
  ): Promise<ResBasic<object>> {
    await this.postService.toggleFavour(user_id, id);
    return new SuccessRes({});
  }

  @Post('toggle-favour')
  @HttpCode(200)
  async toggleStar(
    @Body('user_id') user_id: number,
    @Body('id') id: string,
  ): Promise<ResBasic<object>> {
    await this.postService.toggleStar(user_id, id);
    return new SuccessRes({});
  }

  @Post('increment-share-count')
  @HttpCode(200)
  async incrementShareCount(@Body('id') id: string): Promise<ResBasic<object>> {
    await this.postService.incrementShareCount(id);
    return new SuccessRes({});
  }
}
