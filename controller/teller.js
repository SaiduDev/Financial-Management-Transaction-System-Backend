import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const loginEmployees = async (req, res) => {
    try {
        let { email, password } = req.body;

        
        
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "failed to log in employee"});
    }
}