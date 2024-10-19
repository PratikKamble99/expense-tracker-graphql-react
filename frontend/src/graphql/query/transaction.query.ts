import { gql } from "@apollo/client";

const GET_TRANSACTIONS = gql`
    query fetchTransactions {
        transactions {
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

const GET_TRANSACTION_BY_ID = gql`
    query fetchTransactions($id:ID!) {
        transaction(transactionId:$id) {
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

export { GET_TRANSACTIONS, GET_TRANSACTION_BY_ID };
