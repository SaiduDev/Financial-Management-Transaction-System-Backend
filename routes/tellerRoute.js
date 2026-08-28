import express from "express";
import { empChangePassword, loginEmployees } from "../controller/teller.js";

const empRouter = express.Router();

empRouter.post("/auth/employee/login",  loginEmployees);
empRouter.post("/employee/newPassword", empChangePassword);

export default empRouter;