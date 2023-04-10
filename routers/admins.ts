import { Router } from "express";
import { createAdmin, getAdmins, loginAdmin } from "../controllers/admins";

const router = Router();

router.route("/").get(getAdmins).post(createAdmin);

router.route("/login").post(loginAdmin);
export default router;
