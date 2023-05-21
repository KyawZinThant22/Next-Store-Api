import prisma from "../prisma/client";
import asyncHandler from "../middlewares/asyncHandlers";
import {
  ProductSelectType,
  checkRequiredFields,
  filteredQty,
  isIntergerAndPositive,
  orderedQuery,
  selectAllProductField,
  selectQuery,
} from "../utils/helperFunction";
import errorObj, {
  errorObjType,
  errorTypes,
  resource404Error,
} from "../utils/errorObject";
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
  const queryOffset = req.query.offset;

  //init variables
  let select: Prisma.ProductSelect | ProductSelectType | undefined;
  let orderBy:
    | Prisma.Enumerable<Prisma.ProductOrderByWithRelationInput>
    | undefined;
  let take: number | undefined;
  let price: FilteredType[] = [];
  let stock: FilteredType[] = [];
  let skip: number | undefined;
  let categoryId: string | undefined;

  //returns error if include field is not tag or category
  if (queryInclude) {
    let error: boolean = false;
    let includedFields = (queryInclude as string).split(",");
    includedFields.forEach((field) => {
      if (field !== "tags" && field !== "category") {
        error = true;
      }
    });

    if (error) {
      return next(
        new ErrorResponse(
          {
            status: 400,
            type: errorTypes.badRequest,
            message: "include field is not correct",
          },
          400
        )
      );
    }
  }

  // if select & !include
  if (querySelect && !queryInclude) {
    select = selectQuery(querySelect as string);
  }
  //if select and include
  else if (querySelect && queryInclude) {
    const selectedFields = selectQuery(querySelect as string);
    const includedFields = selectQuery(queryInclude as string);
    select = {
      ...selectedFields,
      ...includedFields,
    };
    //if include & !select
  } else if (!querySelect && queryInclude) {
    const selectAll = selectAllProductField();
    const includedFields = selectQuery(queryInclude as string);
    select = {
      ...selectAll,
      ...includedFields,
    };
  }

  //if order_by param is request
  if (queryOrderBy) {
    orderBy = orderedQuery(queryOrderBy as string);
  }

  //if offset param is request
  if (queryOffset) {
    skip = parseInt(queryOffset as string);
  }

  //if querylinit is request
  if (queryLimit) {
    take = parseInt(queryLimit as string);
  }

  // error obj for price and stock
  const errObj: errorObjType = {
    status: 400,
    type: errorTypes.badRequest,
    message: "same parameter cannot be more than twice",
  };

  // if price param is requested
  if (queryPrice) {
    console.log(queryPrice);
    if (typeof queryPrice !== "string" && (queryPrice as string[]).length > 2) {
      return next(new ErrorResponse(errObj, 400));
    }
    price = filteredQty(queryPrice as string | string[]);
  }

  // if stock param is requested
  if (queryStock) {
    if (typeof queryStock !== "string" && (queryStock as string[]).length > 2) {
      return next(new ErrorResponse(errObj, 400));
    }
    stock = filteredQty(queryStock as string | string[]);
  }

  // if req products with certain category
  if (queryCategory) {
    console.log(queryCategory);
    const category = await prisma.category.findUnique({
      where: { name: queryCategory as string },
    });

    if (!category) {
      return next(new ErrorResponse(resource404Error("category"), 404));
    }
    categoryId = category.id;
  }

  const products = await prisma.product.findMany({
    select,
    orderBy,
    skip,
    take,
    where: {
      categoryId: {
        equals: categoryId,
      },
    },
  });

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
    stock: string | undefined;
  };

  let {
    name,
    price,
    description,
    image1,
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
    stock,
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
