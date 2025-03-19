import mongoose from "mongoose";

const wallet=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    balance:{
        type:Number,
        default:0
    }
},{
    timestamps:true
})

export const Wallet=mongoose.model('wallet',wallet);