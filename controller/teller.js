import pool from "../config/db.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { employeeEmail } from "../queries/query.js";

dotenv.config();

export const loginEmployees = async (req, res) => {
    try {
        let { email, password } = req.body;

        let verifyEmail = await pool.query(employeeEmail, [email]);

        if(verifyEmail.rows.length === 0){
            return res.status(409).json({message: "incorrect email or password"});
        }

        let emp = verifyEmail.rows[0];

        let checkPassword = await bcrypt.compare(password, emp.password);

        if(!checkPassword){
            return res.status(401).json({message: "wrong credentials"});
        }

        let token = jwt.sign(
            {id: emp.id, role: emp.role},
            process.env.JWT_Secret,
            {expiresIn: "9h"}
        );

        res.status(201).json({
            success: true,
            message: "log in successfully",
            token
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "failed to log in employee"});
    }
}


export const empChangePassword = async (req, res) => {
    try {
        let{current_password, new_Password} = req.body;
        let user_id = req.user.id;

        let emp = await pool.query("SELECT * FROM employees WHERE id = $1", [user_id]);
        
        let checkCurrentPassword  = await bcrypt.compare(current_password, emp.rows[0].password);


        if(!checkCurrentPassword){
            return res.status(403).json({message: "current password is incorrect"});
        }

        let hashedPassword = await bcrypt.hash(new_Password, 10);

        let newPassword = await pool.query("UPDATE employees SET password = $1 WHERE id = $2 RETURNING *", [hashedPassword, user_id]);

        res.status(201).json({message: "Password changed"});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "something went wrong, failed to change password"});
    }
}

export const empProfile = async (req, res) => {
    try {
        let userId = req.user.id;

        let profile = await pool.query("SELECT  fullname , email , role , employee_id FROM employees WHERE id = $1",  [userId]);

        res.status(201).json(profile.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "something went wrong, failed to fetch profile"});
    }
}


export const approveBankAccount  = async (req, res) => {
    try {
        let { id } = req.params;

        if(!id){
            return res.status(404).json({message: "No id provided"});
        }

        let approveAccount = await pool.query("UPDATE accounts SET status = 'active' WHERE id = $1 RETURNING *", [id]);


        res.status(201).json({message: "Account Approved successfully"});
        
    } catch (error) {
        res.status(500).json({message: "failed to approve account, something went wrong"});
        console.error(error);
    }
}

export const withdrawMoney = async (req, res) => {
    try {
        let id = req.user.id;

        let { accNumber, amount,  password } = req.body;
        await pool.query("BEGIN");

        let checkAccount = await pool.query("SELECT * FROM accounts WHERE account_number = $1", [accNumber]);

        

        if(checkAccount.rows.length === 0){
           return  res.status(404).json({message: "customer account not found"});
           await pool.query("ROLLBACK");
        }

         if(checkAccount.rows[0].account_balance < amount ){
            return res.status(404).json({message: "insufficient balance to make this transaction"});
            await pool.query("ROLLBACK");

        }

        if(checkAccount.rows[0].status != "active"){
            return res.status(404).json({message: "This account is not active"});
             await pool.query("ROLLBACK");

        }

        let comparePassword = await bcrypt.compare(password, checkAccount.rows[0].password);

        if(!comparePassword){
            return res.status(403).json({message: "password is incorrect"});
             await pool.query("ROLLBACK");

        }
        
        

        await pool.query("UPDATE accounts SET account_balance = account_balance - $1 WHERE account_number = $2 RETURNING *", [amount, accNumber]);

        await pool.query("commit");
       
    } catch (error) {
        await pool.query("rollback");
        res.status(500).json({message: "failed to withdraw money"});

        console.error(error);
    }
}