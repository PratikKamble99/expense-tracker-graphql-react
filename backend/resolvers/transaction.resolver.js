import { transactions } from "../dummyData/data.js";
import Transaction from "../models/transaction.model.js";
import User from "../models/user.model.js";

const transactionResolver = {
  Query: {
    transactions: async (_, { input }, context) => {
      try {
        const user = await context.getUser();
        if (!user) throw new Error("unauthenticated");

        const limit = input?.limit || 0;
        const category = input?.category;
        const startDate = input?.startDate;
        const endDate = input?.endDate;
        const paymentType = input?.paymentType;
        const type = input?.type;
        // accept category, payment_type,date FROM input

        if (startDate && endDate) {
          const query = {
            userId: user._id,
            date: {
              $gte: startDate.toString(),
              $lte: endDate.toString(),
            },
          };

          if (category) query.category = category;
          if (paymentType) query.paymentType = paymentType;
          if (type) query.type = type;
          const transactions = await Transaction.find(query)
            .limit(limit)
            .sort({ date: limit ? -1 : 1 });
          return transactions;
        } else {
          const transactions = await Transaction.find({ userId: user._id })
            .limit(limit)
            .sort({ date: limit ? -1 : 1 });
          console.log("-->", transactions);
          return transactions;
        }
      } catch (error) {
        console.log(error);
        throw new Error(error.message || "Internal server error");
      }
    },
    transaction: async (__, { transactionId }, context) => {
      try {
        const user = await context.getUser();
        if (!user) throw new Error("unauthenticated");

        const transaction = await Transaction.findById(transactionId);
        return transaction;
      } catch (error) {
        console.log(error);
        throw new Error(error.message || "Internal server error");
      }
    },
    categoryStatistics: async (_, __, context) => {
      try {
        const user = await context.getUser();
        if (!user) throw new Error("unauthenticated");
        const transactions = await Transaction.find({ userId: user._id });

        const categoryStatistics = transactions.reduce((acc, transaction) => {
          if (!acc[transaction.category]) {
            acc[transaction.category] = transaction.amount;
          } else {
            acc[transaction.category] += transaction.amount;
          }
          return acc;
        }, {});

        return Object.entries(categoryStatistics).map(
          ([category, totalAmount]) => ({ category, totalAmount })
        );
      } catch (error) {
        console.log(error);
        throw new Error(error.message || "Internal server error");
      }
    },
  },
  Mutation: {
    createTransaction: async (_, { input }, context) => {
      const user = await context.getUser();
      if (!user) throw new Error("unauthenticated");

      try {
        const newTransaction = await Transaction.create({
          ...input,
          userId: user._id,
        });

        await newTransaction.save();

        return newTransaction;
      } catch (error) {
        console.log(error);
        throw new Error(error.message || "Internal server error");
      }
    },
    updateTransaction: async (_, { input }, context) => {
      try {
        const updateTransaction = await Transaction.findByIdAndUpdate(
          input.transactionId,
          input,
          { new: true }
        );
        if (!updateTransaction) throw new Error("Transaction not found");
        return updateTransaction;
      } catch (error) {
        console.log(error);
        throw new Error(error.message || "Internal server error");
      }
    },
    deleteTransaction: async (_, { transactionId }, context) => {
      try {
        const deletedTransaction = await Transaction.findByIdAndDelete(
          transactionId
        );
        if (!deletedTransaction) throw new Error("Transaction not found");
        return deletedTransaction;
      } catch (error) {
        console.log(error);
        throw new Error(error.message || "Internal server error");
      }
    },
    // TODO => ADD TRANSACTION/USER RELATIONSHIP
  },
  // RELATIONSHIPS IN WITH USER
  Transaction: {
    user: async (parent, _, __) => {
      try {
        const user = await User.findById(parent.userId);
        return user;
      } catch (error) {
        console.log(error);
        throw new Error(error.message || "Internal server error");
      }
    },
  },
};

export default transactionResolver;
