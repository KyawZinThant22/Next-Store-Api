import prisma from "../prisma/client";
import asyncHandler from "../middlewares/asyncHandlers";
import { checkRequiredFields } from "../utils/helperFunction";
import errorObj, { errorTypes } from "../utils/errorObject";
import ErrorResponse from "../utils/errorResponse";

/**
 * Get all products
 * @route GET api/v1/products
 * @access Public
 */

export const getProducts = asyncHandler(async (req, res, next) => {
  const products = await prisma.product.findMany();

  res.status(200).json({
    success: true,
    count: products.length,
    data: products,
  });
});

/**
 * Create new product
 * @route POST api/v1/products
 * @access Private
 */

export const createProduct = asyncHandler(async (req, res, next) => {
  type RequiredFieldTypes = {
    name: string | undefined;
    price: string | undefined;
    description: string | undefined;
  };

  let { name, price, description } = req.body;

  const requiredFields: RequiredFieldTypes = {
    name,
    price,
    description,
  };

  //   Throws error if the required fields is not specified
  const hasError = checkRequiredFields(requiredFields, next);
  if (hasError !== false) return hasError;
  console.log("hasError", hasError);

  //   // Throws error if price field is not number or negative number
  //   if (!parseFloat(price) || parseFloat(price) < 0) {
  //     return next(new ErrorResponse(invalidPriceError, 400));
  //   }

  const product = await prisma.product.create({
    data: {
      name,
      price,
      description,
    },
  });

  res.status(200).json({
    success: true,
    data: product,
  });
});

// ===================== Errors ========================
const invalidPriceError = errorObj(
  400,
  errorTypes.invalidArgument,
  "invalid price field",
  [
    {
      code: "invalidPrice",
      message: `price field must only be valid number`,
    },
  ]
);
