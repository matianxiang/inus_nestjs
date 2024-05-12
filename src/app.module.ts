import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InusController } from './inus/inus.controller';
import { UploadModule } from './upload/upload.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [UploadModule, UserModule], //将upload模块导入根模块
  controllers: [AppController, InusController],
  providers: [AppService],
})
export class AppModule {}
