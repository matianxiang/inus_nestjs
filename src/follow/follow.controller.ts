import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  Query,
} from '@nestjs/common';
import { FollowService } from './follow.service';
import {
  FollowDto,
  QueryUserFollowDto,
  QueryFollowRankDto,
} from './dto/create-follow.dto';
import { User } from 'src/user/entities/user.entity';
import { ResBasic } from 'src/types/common';
import { FailedRes, SuccessRes } from 'src/models';

@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Get('rank')
  @HttpCode(200)
  async getTopFollowingUsers(
    @Query() QueryFollowDto: QueryFollowRankDto,
  ): Promise<ResBasic<User[]>> {
    // 调用服务层方法来获取数据
    const res = await this.followService.getTopFollowingUsers(
      QueryFollowDto.size,
    );
    return new SuccessRes(res);
  }

  // 关注该用户的用户列表
  @Get('followers/:user_id')
  @HttpCode(200)
  async getUserFollowers(
    @Param() queryUserFollowDto: QueryUserFollowDto,
  ): Promise<ResBasic<User[]>> {
    // 调用服务层方法来获取数据
    const res = await this.followService.getUserFollowers(
      queryUserFollowDto.user_id,
    );
    return new SuccessRes(res);
  }

  // 该用户的关注列表
  @Get('followings/:user_id')
  @HttpCode(200)
  async getUserFollowings(
    @Param() queryUserFollowDto: QueryUserFollowDto,
  ): Promise<ResBasic<User[]>> {
    // 调用服务层方法来获取数据
    const res = await this.followService.getUserFollowings(
      queryUserFollowDto.user_id,
    );
    return new SuccessRes(res);
  }

  @Post('add')
  @HttpCode(200)
  async followUser(@Body() followDto: FollowDto): Promise<any> {
    // 调用服务层方法来处理新增关注
    const hasFollowExists = await this.followService.followExists(
      followDto.follower_id,
      followDto.following_id,
    );
    if (hasFollowExists) return new FailedRes({}, '关注记录已存在');
    await this.followService.addFollow(
      followDto.follower_id,
      followDto.following_id,
    );
    return new SuccessRes({});
  }

  @Delete('remove')
  @HttpCode(200)
  async unfollowUser(@Body() followDto: FollowDto): Promise<ResBasic<object>> {
    console.log('123', followDto.follower_id, followDto.following_id);
    // 调用服务层方法来处理新增关注
    const hasFollowExists = await this.followService.followExists(
      followDto.follower_id,
      followDto.following_id,
    );
    if (!hasFollowExists) return new FailedRes({}, '关注记录不存在');
    // 调用服务层方法来处理取消关注
    await this.followService.removeFollow(
      followDto.follower_id,
      followDto.following_id,
    );
    return new SuccessRes({});
  }

  @Get('count')
  @HttpCode(200)
  async count(): Promise<ResBasic<number>> {
    const count = await this.followService.count();
    return new SuccessRes(count);
  }

  @Post('mock')
  @HttpCode(200)
  async mockFollowRecords(): Promise<ResBasic<object>> {
    const count = await this.followService.count();
    if (count < 200) {
      await this.followService.generateMockFollows();
      return new SuccessRes({});
    } else {
      return new FailedRes({}, '记录数已经达到200');
    }
  }

  @Delete('clear')
  @HttpCode(200)
  async clearFollowRecords(): Promise<ResBasic<object>> {
    await this.followService.clearFollows();
    return new SuccessRes({});
  }
}
