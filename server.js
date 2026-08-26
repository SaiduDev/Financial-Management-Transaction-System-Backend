import express from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import adminRouter from "./routes/adminRoute.js";

dotenv.config();
const app = express();

try {
    app.use(helmet());
    app.use(cors());
    
} catch (error) {
    
}