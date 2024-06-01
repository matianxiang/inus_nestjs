// src/imgs/dto/create-img.dto.ts
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateImgDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  url: string;

  @IsNumber()
  height: number;

  @IsNumber()
  width: number;

  @IsNumber()
  size: number;
}
