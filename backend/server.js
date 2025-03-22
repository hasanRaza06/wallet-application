import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { connectDB } from './db.js';
import { signup, signin } from './controller/auth.js';
import { getAllUsers } from './controller/user.js';
import { userMiddleWare } from './middleware.js';
import { addAccount, getUserAccounts } from './controller/account.js';

dotenv.config();

const app=express();

app.use(cors());

app.use(express.json());

app.use(express.static("frontend/build"));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
});

const port=process.env.PORT || 3000;

connectDB();


app.get("/",(req,res)=>{
    res.send("Hello from server");
})

//authentication

app.post("/auth/signup",signup);
app.post("/auth/signin",signin);


// users

app.get("/all_users",userMiddleWare,getAllUsers);


//account

app.post("/user/add_account",userMiddleWare,addAccount);
app.get("/account_details",userMiddleWare,getUserAccounts);




app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})