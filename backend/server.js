import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { connectDB } from './db.js';

dotenv.config();

const app=express();

app.use(cors());

app.use(express.json());

const port=process.env.PORT || 3000;

connectDB();


app.get("/",(req,res)=>{
    res.send("Hello from server");
})


app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})