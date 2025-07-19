import { gql } from "@apollo/client";

const GET_TRANSACTIONS = gql`
  query fetchTransactions($input: transactionInput) {
    transactions(input: $input) {
      _id
      userId
      description
      paymentType
      category
      amount
      location
      date
      type
    }
  }
`;


/* 

const GET_TRANSACTIONS = gql`
  query fetchTransactions($input: transactionInput) {
    transactions(input: $input) {
      _id
      userId
      description
      paymentType
      category
      amount
      location
      date
      type
      user {
        profilePicture    // This way we can fetch the user profile picture which is joined from the user table
      }
    }
  }
`;

*/
const GET_TRANSACTION_BY_ID = gql`
  query fetchTransactions($id: ID!) {
    transaction(transactionId: $id) {
      _id
      userId
      description
      paymentType
      category
      amount
      location
      date
      type
    }
  }
`;

const GET_DASHBOARD_SUMMERY = gql`
  query fetchDashboardSummery {
    dashboardSummary {
      totalIncome
      totalExpense
      totalSaving
      percentIncome
      percentExpense
      percentSaving
    }
  }
`;

const GET_CATEGORY_STATISTICS = gql`
  query fetchCategoryStatistics {
    categoryStatistics {
      category
      totalAmount
    }
  }
`;

export {
  GET_TRANSACTIONS,
  GET_TRANSACTION_BY_ID,
  GET_CATEGORY_STATISTICS,
  GET_DASHBOARD_SUMMERY,
};
