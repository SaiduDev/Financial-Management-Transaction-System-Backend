export const sendMoneyValidation = (req, res, next)=>{
    let {sender_number, receiver_number, amount, password} = req.body;

    if(!sender_number || typeof sender_number !=  "string" || sender_number.trim().length <= 9 ){
        return res.status(404).json({message: "please enter a valid sender number"});
    }

     if(!amount || typeof amount !=  "string" || amount < 1 || amount.trim().length > 6){
        return res.status(404).json({message: "please enter valid amount and maximum amount must be 6 digits."});
    }

     if(!receiver_number || typeof receiver_number !=  "string" || receiver_number.trim().length <= 9 ){
        return res.status(404).json({message: "please enter a valid receiver number"});
    }

     if(!password || typeof password !=  "string" || password.trim().length < 6 ){
        return res.status(404).json({message: "password must be more than 6 digits"});
    }

    next();


}

export const adminSignUp =  (req, res, next) => {
    let  { fullname, email, password } = req.body;

    if(!fullname || typeof fullname != "string" || fullname.trim().length < 5){
        return res.status(404).json({message: "fullname must be more than 5 characters"});
    }

     if(!email || typeof email != "string" || email.trim().length < 5 || !email.includes("@")){
        return res.status(404).json({message: "enter a valid email address"});
    }

     if(!password || typeof password != "string" || password.trim().length < 6){
        return res.status(404).json({message: "password must be more than 6 digits"});
    }

    next();
}