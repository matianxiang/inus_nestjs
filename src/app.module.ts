import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InusController } from './inus/inus.controller';

@Module({
  imports: [],
  controllers: [AppController, InusController],
  providers: [AppService],
})
export class AppModule {}
