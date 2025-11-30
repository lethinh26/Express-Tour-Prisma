import { Router } from "express";
import { createAccount, getUser, login } from "../handlers/auth.handle";

const router = Router();
router.get("/:token", getUser);
router.post("/", createAccount);
router.post("/login", login);

export default router;