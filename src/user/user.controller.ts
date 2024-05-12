// src/user/user.controller.ts
import { Controller, Get, Query, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<User[]> {
    return this.userService.findAll(page, limit);
  }

  @Get('count')
  getUserCount(): Promise<number> {
    return this.userService.count();
  }

  @Get(':user_id')
  getUserById(@Param('user_id') user_id: number): Promise<User> {
    return this.userService.findOneById(user_id);
  }
}
