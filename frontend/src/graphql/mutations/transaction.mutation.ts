import { gql } from "@apollo/client";

const CREATE_TRANSACTION = gql`
  mutation crateTransaction($input: createTransactionInput!) {
    createTransaction(input: $input) {
      description
      paymentType
      category
      amount
      location
      date
    }
  }
`;

const UPDATE_TRANSACTION = gql`
  mutation updateTransaction($input: updateTransactionInput!) {
    updateTransaction(input: $input) {
      _id
      userId
      description
      paymentType
      category
      amount
      location
      date
    }
  }
`;

const DELETE_TRANSACTION = gql`
  mutation deleteTransaction($input: ID!) {
    deleteTransaction(transactionId: $input) {
      _id
      userId
      description
      paymentType
      category
      amount
      location
      date
    }
  }
`;

export { CREATE_TRANSACTION, UPDATE_TRANSACTION, DELETE_TRANSACTION };
