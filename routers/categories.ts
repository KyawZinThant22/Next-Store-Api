import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
} from "../controllers/categories";
import { adminOnly } from "../middlewares/authHandlers";

const router = Router();

router.route("/").get(getCategories).post(adminOnly, createCategory);

router.route("/:id").delete(adminOnly, deleteCategory);

export default router;
