import { Controller, Get, HttpCode } from '@nestjs/common';
import { SuccessRes } from 'src/models';
import { ResBasic } from 'src/types/common';

@Controller({
  path: 'inus',
  version: '1', //设置版本前缀
})
export class InusController {
  @Get('list')
  @HttpCode(202)
  list(): ResBasic<string> {
    return new SuccessRes('inus');
  }
}
