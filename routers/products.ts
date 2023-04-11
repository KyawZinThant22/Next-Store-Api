import { adminOnly } from "./../middlewares/authHandlers";
import { Router } from "express";
import {
  getProducts,
  createProduct,
  deleteProduct,
} from "../controllers/products";

const router = Router();

router.get("/", getProducts).post("/", adminOnly, createProduct);

router.delete("/:id", adminOnly, deleteProduct);
export default router;
