import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule); //NestExpressApplication express应用类型
  // 开放静态资源目录
  app.useStaticAssets('public', {
    // __dirname是Node.js的全局变量，表示当前执行脚本所在的目录 这里是指 xxx/inus-nestjs/dist
    // prefix: '/static/' // 指定前缀 /static 就必须用localhost:3000/static/1.jpg
  }); //根目录下的images目录
  // 允许跨域
  app.enableCors();
  // 控制版本
  app.enableVersioning({
    type: VersioningType.URI, //url中显示版本号 HEADER是在请求头中
  });
  await app.listen(3000);
}
bootstrap();
