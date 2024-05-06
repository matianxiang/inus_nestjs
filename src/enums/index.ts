export enum HttpCode {
  OK = 200,
  REDIRECT = 302,
  FAILED = 400, // 参数错误
  UNAUTHORIZED = 401, //未授权
  FORBIDDEN = 403, //验证失败 常用于origin referer验证
  NOT_FOUND = 404, //接口不存在
  INTERNAL_SERVER_ERROR = 500, //服务端错误
}