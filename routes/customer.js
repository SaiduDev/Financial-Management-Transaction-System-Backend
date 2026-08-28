import express from "express";
import { customerProfile, loginCustomer, signUpCustomer } from "../controller/customer.js";
import { authVerify } from "../middleware/authentication.js";
import { authorize } from "../middleware/authorization.js";

const customerRouter = express.Router();

try {
    customerRouter.get("/customer/profile", authVerify, authorize("customer"), customerProfile);
    customerRouter.post("/auth/customer/signUp", signUpCustomer );
    customerRouter.post("/auth/customer/login", loginCustomer);

    
} catch (error) {
    console.error(error);
}
    export default customerRouter;
