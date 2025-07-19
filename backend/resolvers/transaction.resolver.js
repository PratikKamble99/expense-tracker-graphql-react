import { transactions } from "../dummyData/data.js";
import Transaction from "../models/transaction.model.js";
import User from "../models/user.model.js";
import { DateTime } from "luxon";

const transactionResolver = {
  Query: {
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
        const searchQuery = input?.searchQuery;
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
          if (searchQuery) query.$or = [{ description: { $regex: searchQuery, $options: "i" } }];
            const transactions = await Transaction.find(query)
            .limit(limit)
            .sort({ date: limit ? -1 : 1 });
          return transactions;
        } else {
          const transactions = await Transaction.find({ userId: user._id })
            .limit(limit)
            .sort({ date: limit ? -1 : 1 });

          return transactions;
        }
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
          const { category, amount } = transaction;
          // Initialize category if not present
          if (!acc[category]) {
            acc[category] = 0;
          }
          // Sum up the category amount
          acc[category] += amount;
          return acc;
        }, {});

        // Calculate savings once
        if (categoryStatistics.income !== undefined && categoryStatistics.expense !== undefined) {
          categoryStatistics.saving = categoryStatistics.income - (categoryStatistics.expense + categoryStatistics.investment);
        }

        return Object.entries(categoryStatistics).map(
          ([category, totalAmount]) => ({ category, totalAmount })
        );
      } catch (error) {
        console.log(error);
        throw new Error(error.message || "Internal server error");
      }
    },
    dashboardSummary: async (_, __, context) => {
      try {
        const user = await context.getUser();
        if (!user) throw new Error("unauthenticated");

        const currentYear = DateTime.now().year;
        const startDate = DateTime.local(currentYear, 1, 1)
          .startOf("year")
          .toMillis();

        const endDate = DateTime.local(currentYear, 12, 31)
          .endOf("year")
          .toMillis();

        const currentYearTransactions = await Transaction.find({
          userId: user._id,
          date: {
            $gte: startDate.toString(),
            $lte: endDate.toString(),
          },
        });

        const currentYearTotalIncome = currentYearTransactions
          .filter(
            (transaction) =>
              transaction.category === "income" ||
              transaction.category === "saving"
          )
          .reduce((acc, transaction) => acc + transaction.amount, 0);

        const currentYearTotalExpense = currentYearTransactions
          .filter((transaction) => transaction.category === "expense")
          .reduce((acc, transaction) => acc + transaction.amount, 0);

        const currentYearTotalSaving =
          currentYearTotalIncome - currentYearTotalExpense;

        const lastYear = DateTime.now().year - 1;
        const lastYearStartDate = DateTime.local(lastYear, 1, 1)
          .startOf("year")
          .toMillis();
        const lastYearEndDate = DateTime.local(lastYear, 12, 31);

        const lastYearTransactions = await Transaction.find({
          userId: user._id,
          date: {
            $gte: lastYearStartDate.toString(),
            $lte: lastYearEndDate.toString(),
          },
        });

        const lastYearTotalIncome = lastYearTransactions
          .filter(
            (transaction) =>
              transaction.category === "income" ||
              transaction.category === "saving"
          )
          .reduce((acc, transaction) => acc + transaction.amount, 0);

        const lastYearTotalExpense = lastYearTransactions
          .filter((transaction) => transaction.category === "expense")
          .reduce((acc, transaction) => acc + transaction.amount, 0);

        const lastYearTotalSaving = lastYearTotalIncome - lastYearTotalExpense;

        const percentIncome = Math.round(
          ((currentYearTotalIncome - lastYearTotalIncome) /
            lastYearTotalIncome) *
            100
        );
        const percentExpense = Math.round(
          ((currentYearTotalExpense - lastYearTotalExpense) /
            lastYearTotalExpense) *
            100
        );
        const percentSaving = Math.round(
          ((currentYearTotalSaving - lastYearTotalSaving) /
            lastYearTotalSaving) *
            100
        );

        // console.log(

        return {
          totalIncome: currentYearTotalIncome,
          totalExpense: currentYearTotalExpense,
          totalSaving: currentYearTotalSaving,
          percentIncome,
          percentExpense,
          percentSaving,
        };
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
