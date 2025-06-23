import { Router, RequestHandler } from "express";
import { login, register, logout, getCurrentUser } from "../controllers/auth.controller";

const router = Router();

router.post("/login", login as RequestHandler);
router.post("/register", register as RequestHandler);
router.post("/logout", logout as RequestHandler);
router.get("/me", getCurrentUser as RequestHandler);

export default router;
