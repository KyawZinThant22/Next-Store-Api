import prisma from "../prisma/client";
import { Express, Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import asyncHandler from "./asyncHandlers";
import { ExtendedRequest } from "../utils/extendRequest";
import ErrorResponse from "../utils/errorResponse";
import { authRequiredError, unAuthorizedError } from "../utils/errorObject";

/**
 * Middleware for protected routes
 * @description used in routes before and required controllers
 * @returns authError | next()
 */
export const protect = asyncHandler(
  async (req: ExtendedRequest, res: Response, next) => {
    let token: string = "";
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(new ErrorResponse(authRequiredError, 401));
    }

    //verified token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      req.user = await prisma.customer.findUnique({
        where: { id: (decoded as JwtPayload).id },
      });
      next();
    } catch (err) {
      console.log(err);
      return next(new ErrorResponse(authRequiredError, 401));
    }
  }
);

/**
 * Middleware for admin only routes
 * @description used in routes before and admin required controllers
 * @returns authError | next()
 */
export const adminOnly = asyncHandler(
  async (req: ExtendedRequest, res, next) => {
    let token = "";
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(new ErrorResponse(authRequiredError, 401));
    }

    //verify token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      req.admin = await prisma.admin.findUnique({
        where: { id: (decoded as JwtPayload).id },
      });
      next();
    } catch (err) {
      console.log(err);
      return next(new ErrorResponse(authRequiredError, 401));
    }
  }
);

/**
 * Authorized Middleware
 * @param roles - "SUPERADMIN", "ADMIN", "MODERATOR"
 * @returns authorize error | next()
 */
export const authorize =
  (...roles: string[]) =>
  (req: ExtendedRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req!.admin!.role)) {
      return next(new ErrorResponse(unAuthorizedError, 403));
    }
    next();
  };
