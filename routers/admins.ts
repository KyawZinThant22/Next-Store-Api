import { Router } from "express";
import { createAdmin, getAdmins } from "../controllers/admins";

const router = Router();

router.route("/").get(getAdmins).post(createAdmin);

export default router;
