import { Router } from "express";
import { createAccount, getUser, login } from "../handlers/auth.handle";

const router = Router();
router.post("/getUser", getUser);
router.post("/reg", createAccount);
router.post("/login", login);

export default router;