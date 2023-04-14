import asyncHandler from "../middlewares/asyncHandlers";
import prisma from "../prisma/client";
import { IncorrectCredentials, invalidEmail } from "../utils/errorObject";
import ErrorResponse from "../utils/errorResponse";
import { ExtendedRequest } from "../utils/extendRequest";
import {
  checkRequiredFields,
  comparePassword,
  generateToken,
  hashPassword,
  validateEmail,
} from "../utils/helperFunction";

/**
 * Register new customer
 * @route POST /api/v1/auth/register
 * @access PUBLIC
 */
export const registerCustomer = asyncHandler(async (req, res, next) => {
  const email: string = req.body.email;
  const fullname: string = req.body.fullname;
  let password: string = req.body.password;
  const shippingAddress: string = req.body.shippingAddress;
  const phone: string = req.body.phone;

  //check required fields
  const requiredFields = { email, fullname, password, shippingAddress };
  const hasError = checkRequiredFields(requiredFields, next);
  if (hasError !== false) return hasError;

  //validate email
  if (!validateEmail(email)) {
    return next(new ErrorResponse(invalidEmail, 400));
  }

  //hash password
  password = await hashPassword(password);

  const customer = await prisma.customer.create({
    data: {
      fullname,
      password,
      email,
      shippingAddress,
      phone,
    },
  });

  const token = generateToken(customer.id, customer.email);

  res.status(201).json({
    success: true,
    id: customer.id,
    token,
  });
});

/**
 * Login Customer
 * @route POST /api/v1/auth/login
 * @access PUBLIC
 */
export const Login = asyncHandler(async (req, res, next) => {
  const email: string = req.body.email;
  const password: string = req.body.password;

  //check required fields
  const requiredfields = { email, password };
  const hasError = checkRequiredFields(requiredfields, next);
  if (hasError !== false) return hasError;

  const customer = await prisma.customer.findUnique({
    where: { email },
  });

  //Throws error if customer does not exist
  if (!customer) {
    return next(new ErrorResponse(IncorrectCredentials, 401));
  }

  //compare password
  const result = await comparePassword(password, customer.password);

  if (!result) {
    return next(new ErrorResponse(IncorrectCredentials, 401));
  }

  const token = generateToken(customer.id, customer.email);

  res.status(200).json({
    success: true,
    token: token,
    data: {
      id: customer.id,
      email: customer.email,
      fullname: customer.fullname,
      shippingAddress: customer.shippingAddress,
      phone: customer.phone,
    },
  });
});

/**
 * Get current logged-in user
 * @route GET/api/v1/auth/me
 * @access PRIVATE
 */

export const getMe = asyncHandler(async (req: ExtendedRequest, res, next) => {
  const user = await prisma.customer.findUnique({
    where: { id: req?.user?.id },
    select: {
      id: true,
      fullname: true,
      email: true,
      shippingAddress: true,
      phone: true,
    },
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});
