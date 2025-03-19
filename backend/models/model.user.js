import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    account:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Account"
    }],
    wallet:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Wallet"
    },
    myTransactions:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Transaction"
    }]
},{
    timestamps:true
})

export const User=mongoose.model('User',userSchema);