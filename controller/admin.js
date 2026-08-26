import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import pool from "../config/db.js";

dotenv.config();

export const adminSignUp = async(req, res) => {
    try {
        
        
    } catch (error) {
        res.status(500).json({message: "failed to sign up new admin", error: error.message});
        console.error(error);
    }
}