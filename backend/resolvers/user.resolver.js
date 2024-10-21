import bcrypt from "bcryptjs";

import User from "../models/user.model.js";
import Transaction from "../models/transaction.model.js";
import { generatePassword } from "../utils/utils.js";
import { getTransporter } from "../mail-service/sendMail.js";

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
        throw new Error(error.message || "Internal server error");
      }
    },
    user: async (_, { userId }) => {
      try {
        const user = await User.findById({ _id: userId });
        return user;
      } catch (error) {
        console.log(error);
        throw new Error(error.message || "Internal server error");
      }
    },
    // TODO => ADD USER TRANSACTION
  },
  Mutation: {
    signup: async (_, { input }, context) => {
      try {
        const { email, username, password, gender, name } = input;

        if (!email || !username || !password || !gender || !name) {
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
          email,
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
    editUser: async (_, { input }, context) => {
      try {
        const user = await context.getUser();
        if (!user) throw new Error("unauthenticated");

        const updatedUser = await User.findByIdAndUpdate(
          user._id,
          { $set: input },
          { new: true }
        );
        return updatedUser;
      } catch (error) {
        console.log(error);
        throw new Error(error.message || "Internal server error");
      }
    },
    forgotPassword: async (_, { email }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) throw new Error("User not found");

        const newPassword = generatePassword(6);

        const salt = await bcrypt.genSalt(10); // 10 means length of 10 chars
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const updatedUser = await User.updateOne(
          { email },
          { $set: { password: hashedPassword } }
        );

        const transporter = getTransporter();
        console.log(email);

        const info = await transporter.sendMail({
          from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
          to: email, // list of receivers
          subject: "Hello ✔", // Subject line
          text: "Hello world?", // plain text body
          html: "<b>Hello world?</b>", // html body
        });

        console.log("Message sent: %s", info.messageId);

        return { message: "Password sent to your email" };
      } catch (error) {
        console.log(error);
        throw new Error(error.message || "Internal server error");
      }
    },
    changePassword: async (_, { input }, context) => {
      try {
        const { currentPassword, newPassword, confirmPassword } = input;
        const user = await context.getUser();
        if (!user) throw new Error("unauthenticated");

        const findUser = await User.findById({_id: user._id});
        const isValidPassword = await bcrypt.compare(
          currentPassword,
          findUser.password
          );
          if (!isValidPassword) throw new Error("Invalid current password");
          
          if (newPassword !== confirmPassword) {
            throw new Error("Passwords do not match");
          }
          
          const salt = await bcrypt.genSalt(10); // 10 means length of 10 chars
          const hashedPassword = await bcrypt.hash(newPassword, salt);
          
          console.log(hashedPassword, 'hashedPassword');

        const updatedUser = await User.updateOne(
          { _id: user.userId },
          { $set: { password: hashedPassword } }
        );

        console.log(updatedUser)

        return { message : "Changed password successfully"}
      } catch (error) {
        console.log(error);
        throw new Error(error.message || "Internal server error");
      }
    },
  },

  // RELATIONSHIPS IN GRAPHQL
  User: {
    transactions: async (parent, _, __) => {
      try {
        const transactions = await Transaction.find({ userId: parent._id });
        return transactions;
      } catch (error) {
        console.log(error);
        throw new Error(error.message || "Internal server error");
      }
    },
  },
};

export default userResolver;
