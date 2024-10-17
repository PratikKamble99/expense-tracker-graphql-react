// after key name ! mark symbol indicates this filed is required ( not nullable )

const userTypeDef = `#graphql
        type User {
            _id: ID!,
            username: String!,
            password: String!,
            profilePicture:String,
            gender: String!,
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
        }

        input SignupInput {
            username: String!
            name: String!
            password: String!
            gender: String!
        }

        input LoginInput {
            username: String!
            password: String!
        }

        type LogoutResponse {
            message: String!
        }
    `;

export default userTypeDef;
