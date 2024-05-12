import { NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule); //NestExpressApplication express应用类型

  app.set('trust proxy', 1); // 如果在服务器和以太网之间存在负载均衡或者反向代理，Express 可能需要配置为信任 proxy 设置的头文件，从而保证最终用户得到正确的 IP 地址。

  // 开放静态资源目录
  app.useStaticAssets(join(__dirname, 'images'), {
    // __dirname是Node.js的全局变量，表示当前执行脚本所在的目录 这里是指 xxx/inus-nestjs/dist
    // prefix: '/static/' // 指定前缀 /static 就必须用localhost:3000/static/1.jpg
    maxAge: 60 * 1000 * 60, // 最长缓存时间 1h
  }); //根目录下的images目录
  // 允许跨域
  app.enableCors();
  // 控制版本
  app.enableVersioning({
    type: VersioningType.URI, //url中显示版本号 HEADER是在请求头中
  });

  // 全局中间件
  app.use(helmet()); // helemt可以帮助保护应用免受一些众所周知的 Web 漏洞的影响
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  ); // 保护应用程序免受暴力攻击，实现某种速率限制
  await app.listen(3000);
}
bootstrap();
