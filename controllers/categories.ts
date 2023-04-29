import { Prisma } from "@prisma/client";
import asyncHandler from "../middlewares/asyncHandlers";
import {
  checkRequiredFields,
  orderedQuery,
  selectQuery,
} from "../utils/helperFunction";
import prisma from "../prisma/client";

/**
 * Get categories
 * @route GET /api/v1/categories
 * @access PUBLIC
 */
export const getCategories = asyncHandler(async (req, res, next) => {
  // Type Declaration
  type OrderType = { [key: string]: string };

  //Request Queries
  const querySelect = req.query.select;
  const orderQuery = req.query.order_by;

  //filter and sorting initial values
  let select: Prisma.CategorySelect | undefined = undefined;

  let orderBy: OrderType[] = [];

  //if select is send along with request
  if (querySelect) {
    select = selectQuery(querySelect as string);
  }

  //if order ie send along with request
  if (orderQuery) {
    orderBy = orderedQuery(orderQuery as string);
  }
  //Find categories with Prisma client
  const categories = await prisma.category.findMany({
    select,
    orderBy,
  });
  res.status(200).json({
    count: categories.length,
    success: true,
    data: categories,
  });
});

/**
 * create Category
 * @route POST /api/v1/category
 * @access PRIVATE (admin)
 */
export const createCategory = asyncHandler(async (req, res, next) => {
  const queryName: string | undefined = req.body.name;
  const description: string | undefined = req.body.description;
  const thumbnailImage: string | undefined = req.body.thumbnailImage;
  let name: string | undefined;

  //throw error if the name field is not specified
  const hasError = checkRequiredFields(
    { name: queryName, thumbnailImage },
    next
  );
  if (hasError !== false) return hasError;

  //trim the name and chage it inti lowercase
  name = (queryName as string).trim().toLowerCase();

  //create category in prisma client
  const category = await prisma.category.create({
    data: {
      name,
      description,
      thumbnailImage,
    },
  });

  res.status(201).json({
    success: true,
    data: category,
  });
});

/**
 * delete Category
 * @route delete /api/v1/category/:id
 * @access PRIVATE (admin)
 */
export const deleteCategory = asyncHandler(async (req, res, next) => {
  const category_id = req.params.id;

  await prisma.category.delete({
    where: { id: category_id },
  });

  res.status(204).json({
    success: true,
    data: [],
  });
});
