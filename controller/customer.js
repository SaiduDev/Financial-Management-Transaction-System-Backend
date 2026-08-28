import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

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
            {id: newCustomer.rows[0].id, role : newCustomer.rows[0].role },
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
         res.status(500).json({message: "failed to register user", error});
        console.error(error);
    }
}