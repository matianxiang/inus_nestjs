import { HttpCode } from "src/enums";

export interface ResBasic<T> {
  code: HttpCode;
  data: T;
  message: string;
}