import express from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import adminRouter from "./routes/adminRoute.js";
import empRouter from "./routes/tellerRoute.js";
import customerRouter from "./routes/customer.js";


dotenv.config();
const app = express();

try {
    app.use(helmet());
    app.use(cors());
    app.use(express.json({limit: "10kb"}));

    app.use("/api/transaction", adminRouter);
    app.use("/api/transaction", empRouter);
    app.use("/api/transaction", customerRouter);
    
    let port = process.env.PORT || 8080;

    app.listen(port, ()=>{
        console.log(`server running on ${port}`);
    })
} catch (error) {
    console.error(error);
}