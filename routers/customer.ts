import { Router } from "express";
import { adminOnly } from "../middlewares/authHandlers";
import { getCustomer, getCustomers } from "../controllers/customer";

const router = Router();

router.get("/", adminOnly, getCustomers);

router.get("/:id", adminOnly, getCustomer);
export default router;
