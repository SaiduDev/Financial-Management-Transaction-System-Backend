import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import pool from "../config/db.js";

dotenv.config();

export const adminSignUp = async(req, res) => {
    try {
        let { fullname, email, password } = req.body;

        let checkEmail = await pool.query("SELECT * FROM admin WHERE email = $1", [email]);

        if(checkEmail.rows.length >= 1 ){
            return res.status(409).json({message: "Email address already existed"});
        }

        let hashedPassword = await bcrypt.hash(password, 10);

        let newAdmin = await pool.query("INSERT INTO admin ( fullname, email, password ) VALUES($1, $2, $3) RETURNING *", [fullname, email, hashedPassword]);

        let token = jwt.sign(
            {id: newAdmin[0].id, role: newAdmin[0].role},
            process.env.JWT_Secret,
            {expiresIn: "4h"}
        );

        res.status(201).json({
            success: true,
            message: "Admin account created successfully",
            token,
        });
        
    } catch (error) {
        res.status(500).json({message: "failed to sign up new admin", error: error.message});
        console.error(error);
    }
}

export const adminLogIn  = async (req, res) => {
try {
    let { email , password } = req.body;

    let verifyEmail = await pool.query("SELECT * FROM admin WHERE email = $1", [email]);

    if(verifyEmail.rows.length === 0){
        return res.status(409).json({message: "incorrect email or password"});
    }

    let admin = verifyEmail.rows[0];

    let comparePassword = await bcrypt.compare(password, admin.password);

    if(!comparePassword){
        return res.status(401).json({message: "wrong credentials"});
    }

    let token = jwt.sign(
        {id: admin.id, role: admin.role},
        process.env.JWT_Secret,
        {expiresIn: "4h"}
    );

    res.status(201).json(
        {
            success: true,
            message: "Login successfully",
            token
        }
    )
} catch (error) {
       res.status(500).json({message: "failed to log in admin", error: error.message});
        console.error(error);
}
}