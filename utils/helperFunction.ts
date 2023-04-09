import { NextFunction } from "express";
import {
  ErrorDetailType,
  invalidArgDetail,
  invalidArgError,
} from "./errorObject";
import ErrorResponse from "./errorResponse";

/**
 * Check required fields
 * @param requiredObj - required fields as an Obj
 * @param next - express Next function
 * @returns false (hasError) | ErrorResponse
 */
export const checkRequiredFields = (
  requiredObj: { [key: string]: string | undefined },
  next: NextFunction
) => {
  let errorArray: ErrorDetailType[] = [];
  for (const field in requiredObj) {
    if (!requiredObj[field]) {
      errorArray = [...errorArray, invalidArgDetail(field)];
    }
  }
  if (errorArray.length === 0) {
    return false;
  } else {
    return next(new ErrorResponse(invalidArgError(errorArray), 400));
  }
};
