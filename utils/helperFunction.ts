import { NextFunction } from "express";
import bcrypt from "bcrypt";
import {
  ErrorDetailType,
  invalidArgDetail,
  invalidArgError,
} from "./errorObject";
import ErrorResponse from "./errorResponse";
import jwt from "jsonwebtoken";

type OrderType = { [key: string]: string };
type FilteredType = { [key: string]: number };

export type ProductSelectType = {
  id: boolean;
  name: boolean;
  price: boolean;
  discountPercent: boolean;
  description: boolean;
  detail: boolean;
  categoryId: boolean;
  image1: boolean;
  image2: boolean;
  stock: boolean;
  createdAt: boolean;
  updatedAt: boolean;
  tags: boolean;
  category: boolean;
};

export const selectAllProductField = () => ({
  id: true,
  name: true,
  price: true,
  discountPercent: true,
  description: true,
  detail: true,
  categoryId: true,
  image1: true,
  image2: true,
  stock: true,
  createdAt: true,
  updatedAt: true,
});

/**
 * Receives coma seperated strings and return { string : true}
 * @param query comma seperated string
 * @returns objects { string : true , string : true }
 * @examples name,price,stock => { name : true , price : true , stock : true}
 */
export const selectQuery = (query: string) => {
  return query.split(",").reduce((a, v) => ({ ...a, [v.trim()]: true }), {});
};

/**
 * Receive string and return array of { key: value } pairs
 * @param query - query string
 * @returns array of object [ {key:value}, etc]
 * @example 'price.desc,name' => [ { price: 'desc' }, { name: 'asc' } ]
 */
export const orderedQuery = (query: string) => {
  let orderArray: OrderType[] = [];
  const sortLists = query.split(",");

  sortLists.forEach((sl) => {
    const obj: OrderType = {};

    const fields = sl.split(".");
    obj[fields[0]] = fields[1] || "asc";
    orderArray = [...orderArray, obj];
  });

  return orderArray;
};

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
 * Check if a number is positive
 * @param num - num to be checked
 * @returns true | false
 */

export const isIntergerAndPositive = (num: number) => num % 1 === 0 && num > 0;

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

/**
 * Compare input password with store input password
 * @param inputPassword - inputPassword
 * @param storedPassword - storedPassword
 * @returns true | false (promise)
 */
export const comparePassword = (inputPwd: string, storedPwd: string) => {
  return bcrypt.compare(inputPwd, storedPwd);
};

/**
 * generate JsonWebToken
 * @param {number} id - User Id
 * @param { string} email - User email
 * @returns jwt
 */

export const generateToken = (id: string, email: string) => {
  return jwt.sign(
    {
      iat: Math.floor(Date.now() / 1000) - 30,
      id,
      email,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );
};
