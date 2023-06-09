import asyncHandler from "../middlewares/asyncHandlers";
import prisma from "../prisma/client";
import { resource404Error } from "../utils/errorObject";
import ErrorResponse from "../utils/errorResponse";

/**
 * get all Customers
 * @param GET /api/v1/customers
 * @access PRIVATE
 */
export const getCustomers = asyncHandler(async (req, res, next) => {
  const customers = await prisma.customer.findMany({
    select: {
      id: true,
      fullname: true,
      email: true,
      shippingAddress: true,
      phone: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res.status(200).json({
    success: true,
    count: customers.length,
    data: customers,
  });
});

/**
 * get Customer
 * @param GET /api/v1/customers/:id
 * @access PRIVATE
 */
export const getCustomer = asyncHandler(async (req, res, next) => {
  const customer_id = req.params.id;

  const customer = await prisma.customer.findUnique({
    where: { id: customer_id },
    select: {
      id: true,
      fullname: true,
      email: true,
      shippingAddress: true,
      phone: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!customer) {
    return next(new ErrorResponse(resource404Error("customer"), 404));
  }

  res.status(200).json({
    success: true,
    data: customer,
  });
});

/**
 * delete Customer
 * @param GET /api/v1/customers/:id
 * @access PRIVATE
 */
export const deleteCustomer = asyncHandler(async (req, res, next) => {
  const customer_id = req.params.id;

  await prisma.customer.delete({
    where: { id: customer_id },
  });

  res.status(200).json({
    success: true,
    data: [],
  });
});
