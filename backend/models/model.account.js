import mongoose from "mongoose";

const accountSchema=new mongoose.Schema({
    user:{
       type:mongoose.Schema.Types.ObjectId,
       ref:"User",
       required:true
    },
    bankName:{
        type:String,
        required:true
    },
    accountNumber:{
        type:String,
        required:true
    },
    accountHolder:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        default:true
    },
    balance:{
        type:Number,
        required:true
    },
    accountType:{
        type:String,
        enum:['current','saving']
    },
    ifscCode:{
        type:String,
        required:true
    }
},{
    timestamps:true
})

export const Account=mongoose.model("Account",accountSchema);