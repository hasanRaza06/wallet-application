import { Account } from "../models/model.account.js";
import { Wallet } from "../models/model.wallet.js";
import mongoose from "mongoose";
import Transaction from "../models/model.transaction.js";

export const getBalance=async(req,res)=>{
  try {
    const account=await Account.findOne({
        user:req.userId
       })
       const wallet=await Wallet.findOne({
           user:req.userId
       })
       return res.status(200).json({
        success:true,
        message:"Balance fetched successfully",
        accountBalance:account.accountBalance,
        walletBalance:wallet.balance
       })
  } catch (error) {
    return res.status(500).json({
        success:false,
        message:"Internal server error"
    })
  }
}

export const transfer = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { amount, to, fromType, fromId } = req.body;

        if (!amount || !to || !fromType || !fromId) {
            return res.status(400).json({ success: false, message: "Please provide all required details" });
        }

        let sender;
        if (fromType === "wallet") {
            sender = await Wallet.findOne({ _id: fromId, user: req.userId }).session(session);
        } else if (fromType === "account") {
            sender = await Account.findOne({ _id: fromId, userId: req.userId }).session(session);
        } else {
            await session.abortTransaction();
            return res.status(400).json({ success: false, message: "Invalid fromType, must be 'wallet' or 'account'" });
        }

        if (!sender) {
            await session.abortTransaction();
            return res.status(404).json({ success: false, message: "Sender not found" });
        }

        if (sender.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({ success: false, message: "Insufficient Balance" });
        }

        const recipientAccount = await Account.findOne({ userId: to }).session(session);
        if (!recipientAccount) {
            await session.abortTransaction();
            return res.status(404).json({ success: false, message: "Recipient account not found" });
        }

        sender.balance -= amount;
        recipientAccount.balance += amount;

        await sender.save({ session });
        await recipientAccount.save({ session });

        // Create two transaction records: Debit for sender, Credit for receiver
        const debitTransaction = new Transaction({
            fromUserId: req.userId,
            toUserId: to,
            fromType,
            fromId,
            amount,
            transactionType: "debit",
            status: "completed"
        });

        const creditTransaction = new Transaction({
            fromUserId: req.userId,
            toUserId: to,
            fromType,
            fromId,
            amount,
            transactionType: "credit",
            status: "completed"
        });

        const newDebitTransaction = await debitTransaction.save({ session });
        const newCreditTransaction = await creditTransaction.save({ session });

        await User.findByIdAndUpdate(req.userId, { $push: { myTransactions: newDebitTransaction._id } }, { session });
        await User.findByIdAndUpdate(to, { $push: { myTransactions: newCreditTransaction._id } }, { session });

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            success: true,
            message: "Transfer successful",
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Transfer error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
