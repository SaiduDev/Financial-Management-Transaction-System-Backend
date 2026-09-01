import express from "express";
import { sendMoney } from "../controller/transaction.js";
import { authVerify } from "../middleware/authentication.js";
import { authorize } from "../middleware/authorization.js";


const transactionRouter = express.Router();

transactionRouter.post("/transaction/sendMoney",authVerify, authorize("customer"), sendMoney);

export default transactionRouter;