import express from "express";
import { approveBankAccount, empChangePassword, empProfile, loginEmployees } from "../controller/teller.js";
import { authVerify } from "../middleware/authentication.js";
import { authorize } from "../middleware/authorization.js";



const empRouter = express.Router();

empRouter.get("/employee/profile", authVerify, authorize("employee"), empProfile);
empRouter.post("/auth/employee/login",  loginEmployees);
empRouter.post("/employee/newPassword",authVerify, authorize("employee"), empChangePassword);
empRouter.put("/employee/approveAccount/:id", authVerify, authorize("employee"), approveBankAccount);
export default empRouter;