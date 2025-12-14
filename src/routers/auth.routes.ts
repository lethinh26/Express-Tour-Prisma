import { Router } from "express";
import { changePassword, createAccount, deleteAccount, getUser, login, updateUserInfo } from "../handlers/auth.handle";

const router = Router();
router.post("/getUser", getUser);
router.post("/reg", createAccount);
router.post("/login", login);
router.patch("/changepass", changePassword);
router.patch("/updateInfo", updateUserInfo);
router.delete("/deleteAccount", deleteAccount);

export default router;