import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";


export const sendMoney = async (req, res) => {
    try {
        let userId = req.user.id;

        let {sender_number, receiver_number, amount, password} = req.body;

        

        await pool.query("BEGIN");

        let  sender = await pool.query("SELECT * FROM accounts WHERE account_number = $1 AND customer_id  = $2", [sender_number, userId]);
        let receiver = await pool.query("SELECT * FROM accounts WHERE account_number = $1", [receiver_number]);

        if(sender.rows.length === 0){
            return res.status(404).json({message: "Sender Account not Found"});
            await pool.query("ROLLBACK");

        }

        if(sender.rows[0].account_balance < amount){
            return res.status(404).json({message: "failed to transfer money, insufficient balance ."});
            await pool.query("ROLLBACK");

        }

        if(receiver.rows.length === 0 || receiver.rows[0].status != "active"){
            return res.status(404).json({message: "transaction failed, the receiver account is not active"});
            await pool.query("ROLLBACK");

        }

        let checkPassword = await bcrypt.compare(password, sender.rows[0].password);

        if(!checkPassword){
            return res.status(403).json({message: "password is incorrect"});
          await pool.query("ROLLBACK");

        }

        let transId = crypto.randomInt(1000000, 10000000000).toString();
        let creditSender = await pool.query("UPDATE accounts SET account_balance = account_balance - $1 WHERE account_number = $2 AND customer_id = $3 RETURNING *", [amount, sender_number, userId]);

        let debitReceiver = await pool.query("UPDATE accounts SET account_balance = account_balance + $1 WHERE account_number = $2 RETURNING * ", [amount, receiver_number]);

        await pool.query("INSERT INTO transactions (transaction_id, type, doneBy, amount) VALUES ($1, $2, $3, $4) RETURNING *", [transId, 'Money Transfer', userId, amount ]);

        res.status(201).json({message: `Transaction id ${transId} successfully sent ${amount} to ${receiver_number}. `})
        await pool.query("commit");

        
    } catch (error) {
        res.status(500).json({message: "something went wrong, transaction failed", error});
        console.error(error);
        await pool.query("rollback");
    }
}