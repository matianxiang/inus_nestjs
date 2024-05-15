// src/user/user.controller.ts
import {
  Controller,
  Get,
  Query,
  Param,
  Post,
  Body,
  Put,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { ResBasic } from 'src/types/common';
import { SuccessRes } from 'src/models';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('mock')
  @HttpCode(200)
  async mockData(): Promise<ResBasic<object>> {
    const count = await this.userService.count();
    if (count <= 100) {
      await this.userService.mockUser();
    }
    return new SuccessRes({});
  }

  @Delete('clear')
  @HttpCode(200)
  async clearData(): Promise<ResBasic<object>> {
    await this.userService.clearUsers();
    return new SuccessRes(null);
  }

  @Post()
  @HttpCode(200)
  async createUser(@Body() userData: Partial<User>): Promise<ResBasic<User>> {
    const res = await this.userService.createUser(userData);
    return new SuccessRes(res);
  }

  @Post('batch-delete')
  @HttpCode(200)
  async deleteMultipleUsers(
    @Body('user_ids') user_ids: number[],
  ): Promise<ResBasic> {
    await this.userService.deleteMultipleUsers(user_ids);
    return new SuccessRes({});
  }

  @Get()
  @HttpCode(200)
  async getUsers(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<ResBasic<User[]>> {
    const res = await this.userService.findAll(page, limit);
    return new SuccessRes(res);
  }

  @Get('count')
  @HttpCode(200)
  async getUserCount(): Promise<ResBasic<number>> {
    const res = await this.userService.count();
    return new SuccessRes(res);
  }

  @Get('search')
  @HttpCode(200)
  async findUsersByUsername(
    @Query('username') username: string,
  ): Promise<ResBasic<User[]>> {
    const res = await this.userService.findUsersByUsername(username);
    return new SuccessRes(res);
  }

  @Get('sorted-by-creation')
  @HttpCode(200)
  async findUsersByUsernameSortedByCreatedAt(
    @Query('username') username: string,
  ): Promise<ResBasic<User[]>> {
    const res =
      await this.userService.findUsersByUsernameSortedByCreatedAt(username);
    return new SuccessRes(res);
  }

  @Get('sorted-by-following')
  @HttpCode(200)
  async findUsersByUsernameSortedByFollowingCount(
    @Query('username') username: string,
  ): Promise<ResBasic<User[]>> {
    const res =
      await this.userService.findUsersByUsernameSortedByFollowingCount(
        username,
      );
    return new SuccessRes(res);
  }

  @Get(':user_id')
  @HttpCode(200)
  async getUserById(
    @Param('user_id') user_id: number,
  ): Promise<ResBasic<User>> {
    const res = await this.userService.findOneById(user_id);
    return new SuccessRes(res);
  }

  @Put(':user_id')
  @HttpCode(200)
  async updateUser(
    @Param('user_id') user_id: number,
    @Body() updateData: Partial<User>,
  ): Promise<ResBasic<User>> {
    const res = await this.userService.updateUser(user_id, updateData);
    return new SuccessRes(res);
  }

  @Delete(':user_id')
  @HttpCode(200)
  async deleteUser(@Param('user_id') user_id: number): Promise<ResBasic<void>> {
    await this.userService.deleteUser(user_id);
    return new SuccessRes({});
  }
}
