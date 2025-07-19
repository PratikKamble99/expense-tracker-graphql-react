import mongoose from "mongoose";
import { CATEGORY_ENUM } from "../utils/constants.js";

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  paymentType: {
    type: String,
    enum: ["cash", "card"],
    required: true,
  },
  category: {
    type: String,
    enum: ["income", "expense", "investment"],
    required: true,
  },
  type: {
    type: String,
    enum: CATEGORY_ENUM,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    default: "Unknown",
  },
  date: {
    type: Date,
    required: true,
  },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
