import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 允许跨域
  app.enableCors();
  // 控制版本
  app.enableVersioning({
    type: VersioningType.URI //url中显示版本号 HEADER是在请求头中
  })
  await app.listen(3000);
}
bootstrap();
