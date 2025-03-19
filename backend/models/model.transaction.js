import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    toUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fromType: { type: String, enum: ["wallet", "account"], required: true }, // Source type
    fromId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Wallet or Account ID
    amount: { type: Number, required: true },
    transactionType: { type: String, enum: ["debit", "credit"], required: true }, // NEW FIELD
    status: { type: String, enum: ["pending", "completed", "failed"], default: "completed" },
    createdAt: { type: Date, default: Date.now }
});

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
