import { HttpCode } from 'src/enums';

class BasicRes<T> {
  code: HttpCode;
  data: T;
  message: string;

  constructor(data: T, code: HttpCode, message: string) {
    this.data = data;
    this.code = code;
    this.message = message;
  }
}

export class SuccessRes<T> extends BasicRes<T> {
  constructor(data: T) {
    super(data, 200, 'success');
  }
}

export class FailedRes<T> extends BasicRes<T> {
  constructor(data: T, message?: string) {
    super(data, 400, 'failed');
    message && (this.message = message);
  }
}

export class UnauthorizedRes<T> extends BasicRes<T> {
  constructor(data: T, message?: string) {
    super(data, 403, 'unauthorizedRes');
    message && (this.message = message);
  }
}
