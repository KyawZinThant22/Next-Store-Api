import asyncHandler from "../middlewares/asyncHandlers";
import prisma from "../prisma/client";
import {
  IncorrectCredentials,
  invalidEmail,
  roleError,
} from "../utils/errorObject";
import ErrorResponse from "../utils/errorResponse";
import {
  CheckRole,
  checkRequiredFields,
  comparePassword,
  generateToken,
  hashPassword,
  validateEmail,
} from "../utils/helperFunction";

/**
 * Create Admin
 * @route POST api/v1/admin
 * @access PRIVATE (superAdmin)
 */
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

/**
 * Get all admins
 * @route GET api/v1/admins
 * @access Private (superAdmin)
 */
export const getAdmins = asyncHandler(async (req, res, next) => {
  const admins = await prisma.admin.findMany({
    select: {
      id: true,
      userName: true,
      email: true,
      role: true,
      active: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res.status(200).json({
    success: true,
    count: admins.length,
    data: admins,
  });
});

/**
 * admin login
 * @route POST api/v1/admins/login
 * @access PUBLIC
 */

export const loginAdmin = asyncHandler(async (req, res, next) => {
  const email: string | undefined = req.body.email;
  const password: string | undefined = req.body.password;

  //Throws error if required fields not specified
  const requiredFields = { email, password };
  const hasError = checkRequiredFields(requiredFields, next);
  if (hasError != false) return hasError;

  const admin = await prisma.admin.findUnique({
    where: { email },
  });

  //Throws error if email is incorrect
  if (!admin) {
    return next(new ErrorResponse(IncorrectCredentials, 401));
  }

  //check Pwd with hashed Pwd stored in db
  const result = await comparePassword(password as string, admin.password);

  //Throws error if password in incorrect
  if (!result) {
    return next(new ErrorResponse(IncorrectCredentials, 401));
  }

  // Generate a jwt
  const token = generateToken(admin.id, admin.email);

  res.status(200).json({
    success: true,
    token,
  });
});

/**
 * Delete admin
 * @route DELETE api/v1/admin/:id
 * @access PRIVATE (superAdmin)
 */

export const deleteAdmin = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  await prisma.admin.delete({
    where: { id },
  });

  res.status(200).json({
    success: true,
  });
});
