import { HttpCode } from 'src/enums';

export interface ResBasic<T = object> {
  code: HttpCode;
  data: T;
  message: string;
}
