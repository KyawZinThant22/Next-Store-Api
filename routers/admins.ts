import { Router } from "express";
import {
  createAdmin,
  deleteAdmin,
  getAdmin,
  getAdmins,
  loginAdmin,
} from "../controllers/admins";
import { adminOnly, authorize } from "../middlewares/authHandlers";

const router = Router();

router.get("/me", adminOnly, getAdmin);

router
  .route("/")
  .get(adminOnly, authorize("SUPERADMIN"), getAdmins)
  .post(adminOnly, authorize("SUPERADMIN"), createAdmin);

router.route("/login").post(loginAdmin);
router.route("/:id").delete(adminOnly, authorize("SUPERADMIN"), deleteAdmin);

export default router;
