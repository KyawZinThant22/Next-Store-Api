import { Router } from "express";
import { adminOnly } from "../middlewares/authHandlers";
import {
  deleteCustomer,
  getCustomer,
  getCustomers,
} from "../controllers/customer";

const router = Router();

router.get("/", adminOnly, getCustomers);

router
  .get("/:id", adminOnly, getCustomer)
  .delete("/:id", adminOnly, deleteCustomer);
export default router;
