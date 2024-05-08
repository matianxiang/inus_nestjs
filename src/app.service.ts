import { Injectable } from '@nestjs/common';

// providers
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
