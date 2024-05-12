import { HttpCode } from 'src/enums';

class BasicRes {
  code: HttpCode;
  data: any;
  message: string;

  constructor(data: any, code: HttpCode, message: string) {
    this.data = data;
    this.code = code;
    this.message = message;
  }
}

export class SuccessRes extends BasicRes {
  constructor(data: any) {
    super(data, 200, 'success');
  }
}

export class FailedRes extends BasicRes {
  constructor(data: any, message?: string) {
    super(data, 400, 'failed');
    message && (this.message = message);
  }
}

export class UnauthorizedRes extends BasicRes {
  constructor(data: any, message?: string) {
    super(data, 403, 'unauthorizedRes');
    message && (this.message = message);
  }
}
