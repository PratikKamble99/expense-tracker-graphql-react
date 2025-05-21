// after key name ! mark symbol indicates this filed is required ( not nullable )

const userTypeDef = `#graphql
        type User {
            _id: ID!,
            email: String!,
            username: String!,
            name: String!,
            password: String!,
            profilePicture:String,
            gender: String!,
            transactions:  [Transaction!]!
            updatedAt: String
            createdAt: String
            isEmailValid: Boolean
            verificationCode: String
            currency: String
        }

        type Query {
            users:[User!],
            authenticatedUser:User,
            user(userId:ID!): User,
        }

        type Mutation {
            signup(input: SignupInput!): User
            login(input: LoginInput!): User
            logout: StringResponse
            editUser(input: EditUserInput!): User
            verifyEmail(otp: String!): StringResponse
            resendOtp: StringResponse
            forgotPassword(email: String!): StringResponse
            changePassword(input: ChangePasswordInput!): StringResponse
            deleteUserAccount: StringResponse
        }

        input SignupInput {
            email: String!
            username: String!
            name: String!
            password: String!
            gender: String!
        }

        input EditUserInput  {
            username: String,
            name: String,
            password: String,
            profilePicture:String,
            gender: String
        }

        input LoginInput {
            username: String!
            password: String!
        }

        input ChangePasswordInput {
            currentPassword: String!
            newPassword: String!
            confirmPassword: String!
        }

        type StringResponse {
            message: String!
        }
    `;

export default userTypeDef;
