import {
  IsNotEmpty,
  IsInt,
  MinLength,
  MaxLength,
  IsArray,
} from 'class-validator';

export class CreatePostDto {
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  title: string;

  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(5000)
  content: string;

  @IsArray()
  img_ids: string[];
}
