import { Router } from "express";
import { getProducts, createProduct } from "../controllers/products";

const router = Router();

router
    .get("/", getProducts)
    .post("/", createProduct);
export default router;
