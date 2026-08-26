import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

export const authVerify = (req, res, next)=>{
    try {
        let authHeader = req.headers.authorization;

        if(!authHeader){
            return res.status(404).json({message: "No Token provided"});
        }

        let token = authHeader.split(" ")[1];

        let decoded = jwt.verify(token, process.env.JWT_Secret);

        req.user = decode;

        next();
    } catch (error) {
        res.status(500).json({message: "failed to verify Token, please login again"});
        console.error(error);
    }
}