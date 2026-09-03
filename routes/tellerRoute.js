import express from "express";
import { approveBankAccount, empChangePassword, empProfile, loginEmployees, withdrawMoney } from "../controller/teller.js";
import { authVerify } from "../middleware/authentication.js";
import { authorize } from "../middleware/authorization.js";
import loginRateLimiter from "../middleware/rateLimiter.js";




const empRouter = express.Router();

empRouter.get("/employee/profile", authVerify, authorize("employee"), empProfile);
empRouter.post("/auth/employee/login", loginRateLimiter,  loginEmployees);
empRouter.post("/employee/newPassword",authVerify, authorize("employee"), empChangePassword);
empRouter.put("/employee/approveAccount/:id", authVerify, authorize("employee"), approveBankAccount);
empRouter.post("/employee/withdraw", authVerify, authorize("employee"), withdrawMoney);
export default empRouter;