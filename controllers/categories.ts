import { Prisma } from "@prisma/client";
import asyncHandler from "../middlewares/asyncHandlers";
import { orderedQuery, selectQuery } from "../utils/helperFunction";
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
    success: true,
    data: categories,
  });
});
