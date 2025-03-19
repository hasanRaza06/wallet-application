import { User } from "../models/model.user.js";
import { Account } from "../models/model.account.js";

export const addAccount=async(req,res)=>{
    try {
        const {bankName,accountNumber,accountHolder,status,accountBalance,accountType,ifscCode}=req.body;

        if(!bankName || !accountNumber || ! accountHolder || !accountBalance || !accountType || !ifscCode){
            return res.status(400).json({success:false,message:"Please fill all the fields"});
        }

        const user=await User.findOne({_id:req.userId});

        if(status){
            await Account.updateMany(
                { _id: { $in: user.account } },  
                { $set: { select: false } }      
            );
        }

        const account=new Account({
            bankName,accountNumber,accountHolder,status,balance,accountType,ifscCode
        });
        const newAccount=await account.save();
        user.account.push(newAccount._id);
        await user.save();
        return res.status(201).json({success:true,message:"Account Added Successfully",user});
    } catch (error) {
        return res.status(500).json({success:false,message:error.message});
    }
}

