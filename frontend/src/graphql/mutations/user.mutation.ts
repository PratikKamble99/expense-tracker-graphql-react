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

const EDIT_USER = gql`
  mutation EditUser($input: EditUserInput!) {
    editUser(input: $input) {
      _id
      name
      username
      gender
      profilePicture
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

export { SIGN_UP, LOGIN, LOG_OUT, EDIT_USER };
