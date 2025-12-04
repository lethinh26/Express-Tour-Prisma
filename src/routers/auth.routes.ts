import { Router } from "express";
import { changePassword, createAccount, getUser, login } from "../handlers/auth.handle";

const router = Router();
router.post("/getUser", getUser);
router.post("/reg", createAccount);
router.post("/login", login);
router.patch("/changepass", changePassword);

export default router;