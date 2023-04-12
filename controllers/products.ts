import prisma from "../prisma/client";
import asyncHandler from "../middlewares/asyncHandlers";
import {
  checkRequiredFields,
  isIntergerAndPositive,
} from "../utils/helperFunction";
import errorObj, { errorTypes } from "../utils/errorObject";
import ErrorResponse from "../utils/errorResponse";
import { Prisma } from "@prisma/client";

/**
 * Get all products
 * @route GET api/v1/products
 * @access Public
 */
export const getProducts = asyncHandler(async (req, res, next) => {
  type FilteredType = { [key: string]: number };

  // requested query
  const querySelect = req.query.select;
  const queryPrice = req.query.price;
  const queryOrderBy = req.query.order_by;
  const queryInclude = req.query.include;
  const queryLimit = req.query.limit;
  const queryStock = req.query.category;
  const queryCategory = req.query.category;

  //init variables
  let select: Prisma.ProductSelect;

  const products = await prisma.product.findMany({});

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
    image1: string | undefined;
    image2: string | undefined;
  };

  let {
    name,
    price,
    description,
    image1,
    image2,
    discountPercent,
    detail,
    categoryId,
    stock,
  } = req.body;

  const requiredFields: RequiredFieldTypes = {
    name,
    price,
    description,
    image1,
    image2,
  };

  //   Throws error if the required fields is not specified
  const hasError = checkRequiredFields(requiredFields, next);
  if (hasError !== false) return hasError;
  console.log("hasError", hasError);

  // Throws error if price field is not number or negative number
  if (!parseFloat(price) || parseFloat(price) < 0) {
    return next(new ErrorResponse(invalidPriceError, 400));
  }

  //Throws error if stock field is not valid interger
  if (stock) {
    if (stock && !isIntergerAndPositive(stock)) {
      return next(new ErrorResponse(invalidStockError, 400));
    }
    stock = parseInt(stock);
  }

  //Throws error if category is invalid
  if (categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return next(new ErrorResponse(invalidCategoryError(categoryId), 400));
    }
    categoryId = categoryId;
  }

  const product = await prisma.product.create({
    data: {
      name,
      price,
      description,
      image1,
      image2,
      discountPercent,
      detail,
      stock,
      category: {
        connect: { id: categoryId },
      },
    },
  });

  res.status(200).json({
    success: true,
    data: product,
  });
});

/**
 * Delete a product
 * @route DELETE /api/v1/products/:id
 * @access PRIVATE
 */
export const deleteProduct = asyncHandler(async (req, res, next) => {
  const product_id = req.params.id;

  await prisma.product.delete({
    where: { id: product_id },
  });

  res.status(204).json({
    success: true,
    data: [],
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

const invalidStockError = errorObj(
  400,
  errorTypes.invalidArgument,
  "Invalid Stock Field",
  [
    {
      code: "invalidStock",
      message: "Stock field must only be valid interger",
    },
  ]
);

const invalidCategoryError = (categoryId: string) =>
  errorObj(400, errorTypes.invalidArgument, "Invalid category id", [
    {
      code: "Invalid Category",
      message: `there is no category with id ${categoryId}`,
    },
  ]);
