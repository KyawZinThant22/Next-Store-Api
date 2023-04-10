import { NextFunction } from "express";
import bcrypt from "bcrypt";
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

/**
 * Check email is valid
 * @param email - email to be checked
 * @returns true | false
 */
export const validateEmail = (email: string) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(String(email).toLowerCase());
};

/**
 * Check roles
 * @param role
 * @returns true | false
 */
export const CheckRole = (role: string) => {
  const allowedRoles = ["SUPERADMIN", "ADMIN", "MODERATOR"];
  return allowedRoles.includes(role) ? true : false;
};

/**
 * hash plain password
 * @param plan password
 * @returns hashed password
 */

export const hashPassword = (password: string) => bcrypt.hash(password, 10);
