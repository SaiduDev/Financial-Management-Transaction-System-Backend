import express from "express";
import { loginCustomer, signUpCustomer } from "../controller/customer.js";

const customerRouter = express.Router();

try {
    customerRouter.post("/auth/customer/signUp", signUpCustomer );
    customerRouter.post("/auth/customer/login", loginCustomer);
} catch (error) {
    console.error(error);
}