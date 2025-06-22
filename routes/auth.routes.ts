// server/routes/auth.routes.ts
import { Router } from "express";
import { login, register, logout, getCurrentUser } from "../controllers/auth.controller";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.get("/me", getCurrentUser);

export default router;
