import asyncHandler from "../middlewares/asyncHandlers";
import prisma from "../prisma/client";
import { invalidEmail, roleError } from "../utils/errorObject";
import ErrorResponse from "../utils/errorResponse";
import {
  CheckRole,
  checkRequiredFields,
  hashPassword,
  validateEmail,
} from "../utils/helperFunction";

export const createAdmin = asyncHandler(async (req, res, next) => {
  const { userName, email, role, password } = req.body;

  //check required fields
  const requiredFields = { userName, email, password };
  const hasError = checkRequiredFields(requiredFields, next);
  if (hasError !== false) return hasError;

  //validate email
  const validEmail = validateEmail(email);
  if (!validEmail) return next(new ErrorResponse(invalidEmail, 400));

  //hash plain password
  const hashedPassword = await hashPassword(password);

  //Check role is either ADMIN , SUPERADMIN , MODERATOR
  if (role !== undefined) {
    if (!CheckRole(role)) return next(new ErrorResponse(roleError, 400));
  }

  const admin = await prisma.admin.create({
    data: {
      userName,
      email,
      password: hashedPassword,
      role,
    },
  });

  res.status(201).json({
    success: true,
    data: {
      userName,
      email,
      password,
    },
  });
});
