import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

//@Global() 使upload模块成为全局模块 使一切全局化并不是一个好的解决方案。 全局模块可用于减少必要模板文件的数量。 imports 数组仍然是使模块 API 透明的最佳方式。
@Module({
  imports: [MulterModule.register({
    // 存放
    storage: diskStorage({
      // 存放目录
      destination: join(__dirname, '../images'),
      // 命名
      filename: (_, file, callback) => {
        // 时间戳 + 后缀名
        const _fileName = `${new Date().getTime() + extname(file.originalname)}` // extname用来截取文件名字符串后缀
        return callback(null, _fileName)//callback 第一个参数是Error 例如传入new Error(`${file.originalname}存储失败`) 那么就会返回失败
      }
    }),

  })],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule { }
