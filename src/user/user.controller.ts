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
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { ResBasic } from 'src/types/common';
import { SuccessRes } from 'src/models';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() userData: Partial<User>): Promise<ResBasic<User>> {
    const res = await this.userService.createUser(userData);
    return new SuccessRes(res);
  }

  @Put(':user_id')
  async updateUser(
    @Param('user_id') user_id: number,
    @Body() updateData: Partial<User>,
  ): Promise<ResBasic<User>> {
    const res = await this.userService.updateUser(user_id, updateData);
    return new SuccessRes(res);
  }

  @Delete(':user_id')
  async deleteUser(@Param('user_id') user_id: number): Promise<ResBasic<void>> {
    await this.userService.deleteUser(user_id);
    return new SuccessRes({});
  }

  @Delete('batch')
  async deleteMultipleUsers(
    @Body('user_ids') user_ids: number[],
  ): Promise<ResBasic> {
    await this.userService.deleteMultipleUsers(user_ids);
    return new SuccessRes({});
  }

  @Get()
  async getUsers(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<ResBasic<User[]>> {
    const res = await this.userService.findAll(page, limit);
    return new SuccessRes(res);
  }

  @Get('count')
  async getUserCount(): Promise<ResBasic<number>> {
    const res = this.userService.count();
    return new SuccessRes(res);
  }

  @Get(':user_id')
  async getUserById(
    @Param('user_id') user_id: number,
  ): Promise<ResBasic<User>> {
    const res = this.userService.findOneById(user_id);
    return new SuccessRes(res);
  }
}
