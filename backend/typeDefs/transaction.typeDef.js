const transactionTypeDefs = `#graphql
    type Transaction {
        _id: ID!
        userId: String!
        description: String!
        paymentType: String!
        category: String!
        amount: Float!
        location: String
        date: String!
        user:  User!
    }
    
    type Query {
        transactions: [Transaction!]
        transaction(transactionId:ID!): Transaction
        categoryStatistics:[CategoryStatistics!]
    }

    type Mutation {
        createTransaction(input:createTransactionInput!): Transaction!
        updateTransaction(input:updateTransactionInput!): Transaction!
        deleteTransaction(transactionId: ID!): Transaction!
    }

    input createTransactionInput {
        description: String!
        paymentType: String!
        category: String!
        amount: Float!
        location: String
        date: String!
    }

    input updateTransactionInput {
        transactionId: ID!
        description: String
        paymentType: String
        category: String
        amount: Float
        location: String
        date: String
    }

    type CategoryStatistics {
        category: String!
        totalAmount: Float!
    }
`;
export default transactionTypeDefs;
