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
        }

        type Query {
            users:[User!],
            authenticatedUser:User,
            user(userId:ID!): User
        }

        type Mutation {
            signup(input: SignupInput!): User
            login(input: LoginInput!): User
            logout: LogoutResponse
            editUser(input: EditUserInput!): User
            forgotPassword(email: String!): ForgotPasswordResponse
            changePassword(input: ChangePasswordInput!): ChangePasswordResponse
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

        type ChangePasswordResponse {
            message: String!
        }

        type LogoutResponse {
            message: String!
        }

        type ForgotPasswordResponse {
            message: String!
        }
    `;

export default userTypeDef;
