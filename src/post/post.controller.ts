import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  createPost(CreatePostDto) {
    return this.postService.createPost(CreatePostDto);
  }

  @Delete()
  deletePosts(@Query('ids') ids: string[]) {
    return this.postService.deletePostsByIds(ids);
  }

  @Put(':id')
  updatePost(updatePostDto) {
    return this.postService.updatePost(updatePostDto);
  }

  @Get(':id')
  getPostById(@Param('id') id: string) {
    return this.postService.getPostById(id);
  }

  @Post('toggle-favour')
  toggleFavour(@Body('user_id') user_id: number, @Body('id') id: string) {
    return this.postService.toggleFavour(user_id, id);
  }

  @Post('toggle-favour')
  toggleStar(@Body('user_id') user_id: number, @Body('id') id: string) {
    return this.postService.toggleStar(user_id, id);
  }

  @Post('increment-share-count')
  incrementShareCount(@Body('id') id: string) {
    return this.postService.incrementShareCount(id);
  }
}
