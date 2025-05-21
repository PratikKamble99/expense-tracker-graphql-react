import { gql } from "@apollo/client";

const GET_AUTH_USER = gql`
  query GetAuthenticatedUser {
    authenticatedUser {
      _id
      profilePicture
      name
      email
      username
      gender
      updatedAt
      createdAt
      isEmailValid
    }
  }
`;

const GET_USER_AND_TRANSACTIONS = gql`
  query getUserAndTransactions($id: ID!) {
    user(userId: $id) {
      _id
      profilePicture
      name
      username
      # Relationship with Transactions table
      transactions {
        _id
        category
        amount
        date
        description
        location
      }
    }
  }
`;

export { GET_AUTH_USER, GET_USER_AND_TRANSACTIONS };

/* 
    eg. 
    const GET_AUTH_USER = gql`
    query <NAME_)F_CLIENT_QUERY> {
        <QUERY_NAME_IN_BE_RESOLVER> { 
            <PARAMS_WHICH_YOU_WANT_TO_FETCH>
        }
    }
`;

*/
