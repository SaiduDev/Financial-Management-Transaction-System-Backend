import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const signUpCustomer = async (req, res) => {
    try {
        let {fullname ,email , password , customer_id, nationality}
        
    } catch (error) {
        res.status(500).json({message: "failed to register user", error});
        console.error(error);
    }
}