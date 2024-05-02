import { Controller, Get, HttpCode } from '@nestjs/common';
import { SuccessRes } from 'src/models';
import { ResBasic } from 'src/types/common';

@Controller('inus')
export class InusController {
  @Get('list')
  @HttpCode(202)
  list(): ResBasic<string> {
    return new SuccessRes('inus');
  }
}
