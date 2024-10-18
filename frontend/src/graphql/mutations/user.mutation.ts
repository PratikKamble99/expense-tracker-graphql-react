import { gql } from "@apollo/client";

const SIGN_UP = gql`
  mutation signUpUser($input: SignupInput!) {
    signup(input: $input) {
      _id
      name
      username
    }
  }
`;

const LOGIN = gql`
  mutation loginUser($input: LoginInput!) {
    login(input: $input) {
      _id
      name
      username
    }
  }
`;

const LOG_OUT = gql`
  mutation logoutUser {
    logout {
      message
    }
  }
`;

export { SIGN_UP, LOGIN, LOG_OUT };
