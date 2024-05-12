import { HttpCode } from 'src/enums';

class ResBasic {
  code: HttpCode;
  data: any;
  message: string;

  constructor(data: any, code: HttpCode, message: string) {
    this.code = code;
    this.data = data;
    this.message = message;
  }
}

export class SuccessRes extends ResBasic {
  constructor(data: any) {
    super(data, 200, 'success');
  }
}

export class FailedRes extends ResBasic {
  constructor(data: any, message?: string) {
    super(data, 400, 'failed');
    message && (this.message = message);
  }
}

export class UnauthorizedRes extends ResBasic {
  constructor(data: any, message?: string) {
    super(data, 403, 'unauthorizedRes');
    message && (this.message = message);
  }
}
