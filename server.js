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
    app.use(express.json({limit: "10kb"}));

    app.use("/transaction", adminRouter);
    
    let port = process.env.PORT || 8080;

    app.listen(port, ()=>{
        console.log(`server running on ${port}`);
    })
} catch (error) {
    
}