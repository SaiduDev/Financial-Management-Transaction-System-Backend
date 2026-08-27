import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import pool from "../config/db.js";
import { getAdminByEmail, getAdminProfile, getAdminById, updateAdminPassword, registerNewAdmin } from "../queries/query.js";

dotenv.config();

export const adminSignUp = async(req, res) => {
    try {
        let { fullname, email, password } = req.body;

        let checkEmail = await pool.query(getAdminByEmail, [email]);

        if(checkEmail.rows.length >= 1 ){
            return res.status(409).json({message: "Email address already existed"});
        }

        let hashedPassword = await bcrypt.hash(password, 10);

        let newAdmin = await pool.query(registerNewAdmin, [fullname, email, hashedPassword]);
         
        let admin = newAdmin.rows[0];
        let token = jwt.sign(
            {id: admin.id, role: admin.role},
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

    let verifyEmail = await pool.query(getAdminByEmail, [email]);

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

export const adminProfile = async (req, res) => {
    try {
        let adminId = req.user.id;

        let profile = await pool.query(getAdminProfile, [adminId]);

        res.status(201).json(profile.rows[0]);
        
    } catch (error) {
        res.status(500).json({message: "failed to fetch admin profile admin", error: error.message});
        console.error(error);
        
    }
}



export const changePassword = async (req, res) => {
    try {

        let {current_password, newPassword} = req.body;

        let admin = await pool.query(getAdminById, [req.user.id]);

        let comparePassword = await bcrypt.compare(current_password, admin.rows[0].password);

        if(!comparePassword){
            return res.status(400).json({message: "current password is wrong"});
        }

        let hashedPassword = await bcrypt.hash(newPassword, 12);

        let updatedPassword = await pool.query(updateAdminPassword, [hashedPassword, req.user.id]);

        res.status(201).json({message: "password changed successfully"});




    } catch (error) {
          res.status(500).json({message: "failed to change admin password", error: error.message});
        console.error(error);
    }
}