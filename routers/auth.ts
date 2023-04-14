import { Router } from "express";
import { Login, getMe, registerCustomer } from "../controllers/auth";
import { protect } from "../middlewares/authHandlers";

const router = Router();

router.post("/register", registerCustomer);
router.post("/login", Login);
router.get("/me", protect, getMe);

export default router;
