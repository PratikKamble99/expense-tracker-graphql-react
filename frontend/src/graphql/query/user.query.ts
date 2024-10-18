import { gql } from "@apollo/client";

const GET_AUTH_USER = gql`
  query GetAuthenticatedUser {
    authenticatedUser { 
      _id
      username
      profilePicture
    }
  }
`;

export { GET_AUTH_USER };

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
