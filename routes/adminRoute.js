import express from "express";
import { adminLogIn, adminSignUp } from "../controller/admin.js";
import { authVerify } from "../middleware/authentication.js";
import { authorize } from "../middleware/authorization.js";

const adminRouter  = express.Router();

adminRouter.post("/auth/admin/signUp", adminSignUp);
adminRouter.post("/auth/admin/logIn", adminLogIn);


export default adminRouter;