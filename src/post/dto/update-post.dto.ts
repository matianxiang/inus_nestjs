import {
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsArray,
  ValidateNested,
  IsString,
} from 'class-validator';
import { CreateImgDto } from './create-img.dto';
import { Type } from 'class-transformer';

export class UpdatePostDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  title: string;

  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(5000)
  content: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateImgDto)
  // 这里使用 @ValidateNested() 和 @Type() 装饰器来确保数组中的每个对象都符合 CreateImgDto 的结构。
  imgs: CreateImgDto[] = [];
}
