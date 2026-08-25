import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();


const pool = new Pool({
    user: process.env.DB_user,
    host: process.env.DB_host,
    database: process.env.DB_database,
    password: process.env.DB_password,
    port: process.env.DB_port
});

export default pool;