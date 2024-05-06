import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';

//@Global() 使upload模块成为全局模块 使一切全局化并不是一个好的解决方案。 全局模块可用于减少必要模板文件的数量。 imports 数组仍然是使模块 API 透明的最佳方式。
@Module({
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
