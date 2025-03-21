import { User } from "../models/model.user.js";
import { Account } from "../models/model.account.js";

export const addAccount=async(req,res)=>{
    try {
        const {bankName,accountNumber,accountHolder,status,balance,accountType,ifscCode}=req.body;

        if(!bankName || !accountNumber || ! accountHolder || !balance || !accountType || !ifscCode){
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

            user:user._id,bankName,accountNumber,accountHolder,status,balance,accountType,ifscCode
        });
        const newAccount=await account.save();
        user.account.push(newAccount._id);
        await user.save();
        return res.status(201).json({success:true,message:"Account Added Successfully",user});
    } catch (error) {
        return res.status(500).json({success:false,message:error.message});
    }
}


export const updateAccount = async (req, res) => {
    try {
        const { accountId } = req.params; // Get account ID from params
        const { bankName, accountNumber, accountHolder, status, balance, accountType, ifscCode } = req.body;

        // Check if the account exists
        const account = await Account.findById(accountId);
        if (!account) {
            return res.status(404).json({ success: false, message: "Account not found" });
        }

        // Update fields if provided
        if (bankName) account.bankName = bankName;
        if (accountNumber) account.accountNumber = accountNumber;
        if (accountHolder) account.accountHolder = accountHolder;
        if (status !== undefined) account.status = status;
        if (accountBalance !== undefined) account.balance = balance;
        if (accountType) account.accountType = accountType;
        if (ifscCode) account.ifscCode = ifscCode;

        // If the status is updated to true, deselect all other accounts
        if (status) {
            const user = await User.findOne({ _id: req.userId });
            await Account.updateMany(
                { _id: { $in: user.account } },
                { $set: { status: false } }
            );
        }

        // Save the updated account
        await account.save();

        return res.status(200).json({ success: true, message: "Account updated successfully", account });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


export const deleteAccount = async (req, res) => {
    try {
        const { accountId } = req.params; // Get account ID from params

        // Check if the account exists
        const account = await Account.findById(accountId);
        if (!account) {
            return res.status(404).json({ success: false, message: "Account not found" });
        }

        // Remove account from the user's list
        const user = await User.findById(req.userId);
        user.account = user.account.filter(id => id.toString() !== accountId);
        await user.save();

        // Delete the account from the database
        await Account.findByIdAndDelete(accountId);

        return res.status(200).json({ success: true, message: "Account deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


export const getUserAccounts = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate("account");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({ success: true, accounts: user.account });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


