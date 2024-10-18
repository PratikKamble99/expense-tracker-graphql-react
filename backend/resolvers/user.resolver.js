import { users } from "../dummyData/data.js";
import bcrypt from "bcryptjs";

import User from "../models/user.model.js";

const userResolver = {
  Query: {
    users: async (parent, args, context) => {
      try {
        const users = await User.find();
        return users;
      } catch (error) {
        console.log(error);
      }
      return users;
    },
    authenticatedUser: async (_, __, context) => {
      try {
        const user = await context.getUser();
        return user;
      } catch (error) {
        console.log(error);
      }
    },
    user: async (_, { userId }) => {
      try {
        const user = await User.findById({ _id: userId });
        return user;
      } catch (error) {
        console.log(error);
      }
    },
    // TODO => ADD USER TRANSACTION
  },
  Mutation: {
    signup: async (_, { input }, context) => {
      try {
        const { username, password, gender, name } = input;

        if (!username || !password || !gender || !name) {
          throw new Error("All field are required");
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
          throw new Error("User already exists");
        }

        const salt = await bcrypt.genSalt(10); // 10 means length of 10 chars
        const hashedPassword = await bcrypt.hash(password, salt);

        const profilePicture = `https://avatar.iran.liara.run/public/${
          gender == "male" ? "boy" : "girl"
        }?username=${username}`;

        const newUser = new User({
          username,
          password: hashedPassword,
          gender,
          name,
          profilePicture: profilePicture,
        });

        await newUser.save();
        await context.login(newUser);
        return newUser;
      } catch (error) {
        console.log(error);
        throw new Error(error.message || "Internal server error");
      }
    },
    login: async (_, { input }, context) => {
      try {
        const { username, password } = input;

        if (!username || !password) {
          throw new Error("All field are required");
        }

        const { user } = await context.authenticate("graphql-local", {
          username,
          password,
        }); // not available for subscriptions

        await context.login(user);
        return user;
      } catch (error) {
        console.log(error);
        throw new Error(error.message || "Internal server error");
      }
    },
    logout: async (_, __, context) => {
      try {
        const { req, res } = context;
        await context.logout();

        req.session.destroy((err) => {
          if (err) throw err;
        });

        res.clearCookie("connect.sid");

        return { message: " Logged out successfully" };
      } catch (error) {
        console.log("Error in logout", error);
        throw new Error(error.message || "Internal server error");
      }
    },
  },
};

export default userResolver;
