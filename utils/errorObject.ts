export type errorObjType = {
  status: number;
  type: string;
  message: string;
  detail?: any[];
};

export const errorTypes = {
  notFound: "notFound",
  badRequest: "badRequest",
  internalError: "internalError",
  alreadyExists: "alreadyExists",
  missingField: "missingField",
  invalidQuery: "invalidQuery",
  invalidArgument: "invalidArgument",
  invalidToken: "invalidToken",
  expireToken: "expireToken",
  unauthorized: "unauthorized",
  forbidden: "forbidden",
};

const errorObj = (
  status: number,
  type: string,
  message: string,
  detail?: any[]
) => ({
  status,
  type,
  message,
  detail,
});

export type ErrorDetailType = {
  code: string;
  message: string;
};

/**
 * Invalid Argument Detail Error
 * @return Object - { code: "missingSomething", message: "some field is missing"}
 */
export const invalidArgDetail = (str: string) => {
  return {
    code: `missing${str.charAt(0).toUpperCase()}${str.slice(1)}`,
    message: `${str} field is missing`,
  };
};

/**
 * Invalid Argument Error
 * @return Object - { 400, invalidArgument, "invalid one or more argument(s)"}`
 */

export const invalidArgError = (detail: ErrorDetailType[]) => {
  return errorObj(
    400,
    errorTypes.invalidArgument,
    "invalid one or more argument(s)",
    detail
  );
};

/**
 * Internal Server Error
 * @description { 500, internalError, "internal server error" }
 */
export const defaultError = errorObj(
  500,
  errorTypes.internalError,
  "internal server error"
);

/**
 * Invalid email error
 * @description {400, invalidArgument , "email is not valid"}
 */
export const invalidEmail = errorObj(
  400,
  errorTypes.invalidArgument,
  "email is not valid"
);

/**
 * Unauthorized error
 * @description {403 , forbidden , "not authroized"}
 */
export const unAuthorizedError = errorObj(
  403,
  errorTypes.forbidden,
  "not authorized"
);

/**
 * Auth required error
 * @description {401 , "unauthorized" , "Authentication required"}
 */
export const authRequiredError = errorObj(
  401,
  errorTypes.unauthorized,
  "Authentication required"
);

/**
 * Chec role error
 * @description {400 , invalidArgument , "role type is not a valid"}
 */
export const roleError = errorObj(
  400,
  errorTypes.invalidArgument,
  "Role type is not a valid"
);

export default errorObj;
