import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, HttpCode } from '@nestjs/common';
import { UploadService } from './upload.service';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResBasic } from 'src/types/common';
import { SuccessRes } from 'src/models';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  @Post('album')
  @UseInterceptors(FileInterceptor('file')) //上传文件必须要用到UseInterceptors中间件 单文件用FileInterceptor 多文件用FilesInterceptor
  @HttpCode(200)
  upload(@UploadedFile() file): ResBasic<string> {
    console.log('file', file)
    return new SuccessRes('上传文件成功')
  }

}
