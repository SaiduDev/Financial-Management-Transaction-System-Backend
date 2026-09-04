import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";


export const sendMoney = async (req, res) => {

    const client = await pool.connect();

    try {
        
        let userId = req.user.id;

        let {sender_number, receiver_number, amount, password} = req.body;

        

        await pool.query("BEGIN");

        let  sender = await client.query("SELECT * FROM accounts WHERE account_number = $1 AND customer_id  = $2", [sender_number, userId]);
        let receiver = await client.query("SELECT * FROM accounts WHERE account_number = $1", [receiver_number]);

        if(sender.rows.length === 0){
            await client.query("ROLLBACK");
            return res.status(404).json({message: "Sender Account not Found"});

        }

        if(sender.rows[0].account_balance < amount){
          await client.query("ROLLBACK");
            return res.status(404).json({message: "failed to transfer money, insufficient balance ."});

        }

        if(receiver.rows.length === 0 || receiver.rows[0].status != "active"){
              await client.query("ROLLBACK");
            return res.status(404).json({message: "transaction failed, the receiver account is not active"});

        }

        let checkPassword = await bcrypt.compare(password, sender.rows[0].password);

        if(!checkPassword){
             await client.query("ROLLBACK");

            return res.status(403).json({message: "password is incorrect"});

        }

        let transId = crypto.randomInt(1000000, 10000000000).toString();
        let creditSender = await client.query("UPDATE accounts SET account_balance = account_balance - $1 WHERE account_number = $2 AND customer_id = $3 RETURNING *", [amount, sender_number, userId]);

        let debitReceiver = await client.query("UPDATE accounts SET account_balance = account_balance + $1 WHERE account_number = $2 RETURNING * ", [amount, receiver_number]);

        await client.query("INSERT INTO transactions (transaction_id, type, doneBy, amount) VALUES ($1, $2, $3, $4) RETURNING *", [transId, 'Money Transfer', userId, amount ]);
        
        await pool.query("commit");

        res.status(200).json({message: `Transaction id ${transId} successfully sent ${amount} to ${receiver_number}. `})

        
    } catch (error) {
        await client.query("rollback");
        res.status(500).json({message: "something went wrong, transaction failed", error});
        console.error(error);
    } finally{
        await client.release();
    }
}