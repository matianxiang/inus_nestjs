import { Type } from 'class-transformer';
import { IsNumber, IsNotEmpty, IsInt } from 'class-validator';

export class FollowDto {
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  follower_id: number;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  following_id: number;
}

export class QueryFollowRankDto {
  @Type(() => Number)
  @IsNotEmpty()
  size: number;
}

export class QueryUserFollowDto {
  @Type(() => Number)
  @IsNotEmpty()
  user_id: number;
}
