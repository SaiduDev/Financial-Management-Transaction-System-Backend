import express from "express";
import { accountProfile, ApplyForBankAccount, checkAccountBalance, customerProfile, loginCustomer, signUpCustomer } from "../controller/customer.js";
import { authVerify } from "../middleware/authentication.js";
import { authorize } from "../middleware/authorization.js";

const customerRouter = express.Router();

try {
    customerRouter.get("/customer/accountProfile", authVerify, authorize("customer"), accountProfile );
    customerRouter.get("/customer/accountBalance", authVerify, authorize("customer"), checkAccountBalance);
    customerRouter.get("/customer/profile", authVerify, authorize("customer"), customerProfile);
    customerRouter.post("/auth/customer/signUp", signUpCustomer );
    customerRouter.post("/auth/customer/login", loginCustomer);
    customerRouter.post("/customer/accountApplication", authVerify, authorize("customer"), ApplyForBankAccount);

    
} catch (error) {
    console.error(error);
}
    export default customerRouter;
