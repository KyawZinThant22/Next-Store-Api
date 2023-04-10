import { Router } from "express";
import { createAdmin } from "../controllers/admins";

const router = Router();

router.route("/").post(createAdmin);

export default router;
