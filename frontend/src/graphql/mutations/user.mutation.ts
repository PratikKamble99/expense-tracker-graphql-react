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

const CHANGE_PASSWORD = gql`
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input) {
      message
    }
  }
`;

const DELETE_ACCOUNT = gql`
  mutation deleteUserAccount {
    deleteUserAccount {
      message
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

// This mutation takes an OTP as an argument and returns a message
/* 
  const VERIFY_EMAIL = gql`
    mutation VerifyEmail($input: String!) { // after mutation name is refers from the client
      verifyEmail(otp: $input) { // this is the name of the mutation in the server
        message
      }
    }
  `;
*/
const VERIFY_EMAIL = gql`
  mutation VerifyEmail($input: String!) {
    verifyEmail(otp: $input) {
      message
    }
  }
`;

// This mutation not takes any arguments and returns a message
const RESEND_OTP = gql`
  mutation ResendOtp {
    resendOtp {
      message
    }
  }
`;

const FORGOT_PASSWORD = gql`
  mutation ForgotPassword($input: String!) {
    forgotPassword(email: $input) {
      message
    }
  }
`;

export {
  SIGN_UP,
  LOGIN,
  LOG_OUT,
  EDIT_USER,
  FORGOT_PASSWORD,
  CHANGE_PASSWORD,
  DELETE_ACCOUNT,
  VERIFY_EMAIL,
  RESEND_OTP,
};
