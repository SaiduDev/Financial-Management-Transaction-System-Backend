import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";
dotenv.config();

export const signUpCustomer = async (req, res) => {
    try {
        let { fullname ,email , password } = req.body;

        let checkEmail = await pool.query("SELECT * FROM Customers WHERE email = $1 ", [email]);

        if(checkEmail.rows.length >= 1){
            return res.status(409).json({message: "Email already existed"});
        }

        let hashedPassword = await bcrypt.hash(password, 10);

        let newCustomer = await pool.query("INSERT INTO customers (fullname ,email , password ) VALUES ($1, $2, $3) RETURNING * ", [fullname, email, hashedPassword]);


        let token = jwt.sign(
            {id: newCustomer.rows[0].id, role: newCustomer.rows[0].role },
            process.env.JWT_Secret,
            {expiresIn: "9h"}
        );

        res.status(201).json({
            success: true,
            message: "account created successfully",
            token
        });
        
    } catch (error) {
        res.status(500).json({message: "failed to register user", error});
        console.error(error);
    }
}

export const loginCustomer = async (req, res) => {
    try {
        let { email, password } = req.body;

        let checkEmail = await pool.query("SELECT * FROM customers WHERE email = $1",[email]);

        if(checkEmail.rows.length === 0){
            return res.status(404).json({message: "incorrect email or password"});
        }

        let customer = checkEmail.rows[0];

        let checkPassword = await bcrypt.compare(password, customer.password);

        if(!checkPassword){
            return res.status(403).json({message: "wrong credentials"});
        }

        let token = jwt.sign(
            {id: customer.id, role: customer.role},
            process.env.JWT_Secret,
            {expiresIn: "9h"}
        );

        res.status(201).json({
            success: true,
            message: "log in successfully",
            token
        });
    } catch (error) {
         res.status(500).json({message: "failed to login user", error});
        console.error(error);
    }
}


export let customerProfile = async (req, res) => {
    
    try {
        let user_id = req.user.id;

        let profile = await pool.query("SELECT fullname, email, role FROM customers WHERE id = $1", [user_id] );

        res.status(200).json(profile.rows[0]);
        
    } catch (error) {
          res.status(500).json({message: "failed to load user profile", error});
        console.error(error);
    }
}


export const ApplyForBankAccount = async (req, res) => {
    try {
        let customer_id = req.user.id;
        let account_number = crypto.randomInt(1000000000, 9999999999).toString();
        let { password } = req.body;
        
        let checkUser = await pool.query("SELECT * FROM accounts WHERE customer_id = $1", [customer_id]);

        if(checkUser.rows.length >= 1){
            return res.status(409).json({message: "Customer already created account"});
        }

        let hashedPassword = await bcrypt.hash(password, 12);

        let checkAccountNumber = await pool.query("SELECT account_number FROM accounts WHERE account_number = $1", [account_number]);

        if(checkAccountNumber.rows.length >= 1){
            return res.status(409).json({message: "something went wrong please try again"});
        }

      

        let newAccount = await pool.query("INSERT INTO accounts (customer_id, account_number, password) VALUES($1, $2, $3) RETURNING * ", [customer_id, account_number, hashedPassword]);  



        res.status(201).json({message: "Applied successfully, you will be notified once you account is approved."});


    } catch (error) {
        res.status(500).json({message: "failed to apply for bank account", error});
        console.error(error);
    }
}


export const checkAccountBalance = async (req, res) => {
    try {
        let id = req.user.id;

        let balance = await pool.query("SELECT balance FROM accounts AS balance WHERE customer_id = $1", [id]);

        res.status(201).json(balance.rows[0].balance);

        
    } catch (error) {
        res.status(500).json({message: "failed to get Account Balance", error});
        console.error(error);
    }
}

export const accountProfile = async (req, res) => {
    try {
        let id = req.user.id;

        let accProfile = await pool.query("SELECT customer_id , account_number , account_balance , status FROM accounts WHERE customer_id = $1", [id]);

        res.status(201).json(accProfile.rows[0]);

    } catch (error) {
        res.status(500).json({message: "failed to fetch account data"})
        console.error(error);
    }
}