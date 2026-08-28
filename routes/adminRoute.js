import express from "express";
import { adminLogIn, adminSignUp, adminProfile, changePassword } from "../controller/admin.js";
import { authVerify } from "../middleware/authentication.js";
import { authorize } from "../middleware/authorization.js";
import { loginRateLimiter } from "../middleware/rateLimiter.js";

const adminRouter  = express.Router();

adminRouter.get("/admin/profile", authVerify, authorize("admin"), adminProfile);
adminRouter.post("/auth/admin/signUp", adminSignUp);
adminRouter.post("/auth/admin/logIn", loginRateLimiter, adminLogIn);
adminRouter.post("/admin/changePassword", authVerify, authorize("admin"), changePassword);


export default adminRouter;