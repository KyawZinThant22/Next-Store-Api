import { adminOnly } from "./../middlewares/authHandlers";
import { Router } from "express";
import {
  getProducts,
  createProduct,
  deleteProduct,
  getProduct,
} from "../controllers/products";

const router = Router();

router.get("/", getProducts).post("/", adminOnly, createProduct);
router.get("/:id", getProduct);
router.delete("/:id", adminOnly, deleteProduct);
export default router;
