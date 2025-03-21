import { generateToken } from '../middleware.js';
import {User} from '../models/model.user.js';
import bcrypt from 'bcryptjs';
import { Wallet } from '../models/model.wallet.js';

export const signup=async(req , res)=>{
    try {
        const {name,email,password,phoneNumber}=req.body;

        if(!name || !email || !password || !phoneNumber){
            return res.status(400).json({success:false,message:"Please fill in all fields"});
        }

        const user=await User.findOne({$or: [{ email }, { phoneNumber }]});
        if(user){
            return res.status(400).json({success:false,message:"Email or Phone Number already exists"});
        }
        const hashedPassword=await bcrypt.hash(password,10);
        const newUser=new User({
            name,
            email,
            password:hashedPassword,
            phoneNumber
        })
        
        let wallet;
        try {
            wallet = await Wallet.create({ user: newUser._id, balance: 0 });
            newUser.wallet = wallet._id;
        } catch (walletError) {
            console.error("Error creating wallet:", walletError.message);
            return res.status(500).json({ success: false, message: "Error creating wallet" });
        }

        await newUser.save();

        const token =generateToken(newUser);

        return res.status(201).json({success:true,message:"SignUp Completed",token,newUser});
    } catch (error) {
        return res.status(500).json({success:false,message:"Internal server error"});
    }
}

export const signin=async(req , res)=>{
    try {
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({success:false,message:"Please fill in all fields"});
        }
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({success:false,message:"Invalid email or password"});
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({success:false,message:"Incorrect Password"});
        }
        const token =generateToken(user);
        return res.status(200).json({success:true,message:"LogIn Completed",token,user});
    } catch (error) {
        return res.status(500).json({success:false,message:"Internal server error"});
    }
}