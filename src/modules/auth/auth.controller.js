import { Router } from "express";
import { login, register, resetPassword, sendOtp } from "./auth.service.js";
const router = Router();

router.post("/register", register)
router.post("/login", login)
router.post("/sendOtp", sendOtp)
router.post("/resetpassword" , resetPassword)



export default router ;


