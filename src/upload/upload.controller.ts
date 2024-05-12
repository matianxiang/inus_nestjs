import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  Res,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResBasic } from 'src/types/common';
import { SuccessRes } from 'src/models';
import { join } from 'path';
import { Response } from 'express';
import { zip } from 'compressing';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('album')
  @UseInterceptors(FileInterceptor('file')) //上传文件必须要用到UseInterceptors中间件 单文件用FileInterceptor 多文件用FilesInterceptor
  @HttpCode(200)
  upload(@UploadedFile() file): ResBasic<string> {
    console.log('file', file);
    return new SuccessRes('上传文件成功');
  }

  // 直接下载文件
  @Get('download')
  download(@Res() res: Response) {
    const url = join(__dirname, `../images/1.svg`);
    res.download(url);
  }

  // 获取照片二进制流 前端自己下载
  @Get('stream')
  async stream(@Res() res: Response) {
    const temp_file_name = '1.svg';
    const url = join(__dirname, `../images/${temp_file_name}`);
    const tarStream = new zip.Stream(); //压缩文件
    await tarStream.addEntry(url);

    // 设置返回头
    res.setHeader('Content-Type', 'application-octet-stream');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${temp_file_name}`,
    );

    tarStream.pipe(res);
  }
}
