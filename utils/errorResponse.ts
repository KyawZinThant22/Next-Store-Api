import { errorObjType } from "./errorObject";

class ErrorResponse extends Error {
  public errObj: errorObjType;
  public statusCode: number;
  constructor(errObj: errorObjType, statusCode: number) {
    super();
    this.errObj = errObj;
    this.statusCode = statusCode;
  }
}

export default ErrorResponse;
