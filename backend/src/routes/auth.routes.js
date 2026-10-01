import { Router } from "express";
import { currentAdmin, login } from "../controllers/auth.controller.js";
import { requireAdmin } from "../middlewares/auth.js";

const router = Router();
router.post("/login", login);
router.get("/me", requireAdmin, currentAdmin);
export default router;
