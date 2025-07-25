import bcrypt from "bcryptjs";

import User from "../models/user.model.js";
import Transaction from "../models/transaction.model.js";
import { generate6DigitOTP, generatePassword } from "../utils/utils.js";
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

        const { user } = await context.authenticate("graphql-local", {
          username,
          password,
        });

        await context.login(user);

        return user;
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
        });

        if (!user.isEmailValid) {
          const otp = generate6DigitOTP();

          // add logic to push otp to db
          const otpExpireTime = new Date();
          otpExpireTime.setMinutes(otpExpireTime.getMinutes() + 10);
          user.verificationCode = otp;
          user.otpExpireTime = otpExpireTime;
          await user.save();

          const transporter = getTransporter();

          const info = await transporter.sendMail({
            from: `<${process.env.NODEMAILER_USER_EMAIL}>`,
            to: user.email,
            subject: "Your Email Verification Code",
            text: `Your One-Time Password (OTP) is: ${otp}. It will expire in 10 minutes.`,
            html: `
              <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
                <h2 style="color: #4F46E5;">Email Verification</h2>
                <p>Hi there,</p>
                <p>Thank you for Login. Please use the code below to verify your email address:</p>
                <h1 style="letter-spacing: 6px; font-size: 28px; color: #111;">${otp}</h1>
                <p>This code will expire in <strong>10 minutes</strong>.</p>
                <p>If you did not request this, you can safely ignore this email.</p>
                <br />
                <p>Thanks,<br />The Coinkeeper</p>
              </div>
            `,
          });

          // write logic to generate otp and send to email and store into db
        }

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
    verifyEmail: async (_, { otp }, context) => {
      try {
        const user = await context.getUser();
        if (!user) throw new Error("unauthenticated");

        if (user.isEmailValid) {
          throw new Error("Email already verified");
        }

        const currentTime = new Date();
        if (currentTime > user.otpExpireTime) {
          throw new Error("OTP expired");
        }

        if (user.verificationCode !== otp) {
          throw new Error("Invalid OTP");
        }

        user.isEmailValid = true;
        user.verificationCode = "";
        user.otpExpireTime = null;

        await user.save();

        return { message: "Email verified successfully" };
      } catch (error) {
        console.log(error);
        throw new Error(error.message || "Internal server error");
      }
    },
    resendOtp: async (_, __, context) => {
      try {
        const user = await context.getUser();
        if (!user) throw new Error("unauthenticated");
        if (user.isEmailValid) {
          throw new Error("Email already verified");
        }
        const otp = generate6DigitOTP();
        const otpExpireTime = new Date();
        otpExpireTime.setMinutes(otpExpireTime.getMinutes() + 10);
        user.verificationCode = otp;
        user.otpExpireTime = otpExpireTime;
        await user.save();
        const transporter = getTransporter();
        const info = await transporter.sendMail({
          from: `<${process.env.NODEMAILER_USER_EMAIL}>`,
          to: user.email,
          subject: "Your Email Verification Code",
          text: `Your One-Time Password (OTP) is: ${otp}. It will expire in 10 minutes.`,
          // html: `
          //   <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
          //   <h2 style="color: #4F46E5;">Your Verification Code</h2>
          //   <p>Hi there,</p>
          //   <p>As requested, here is your new One-Time Password (OTP) to verify your email address:</p>
          //   <h1 style="letter-spacing: 6px; font-size: 28px; color: #111;">${otp}</h1>
          //   <p>This code is valid for <strong>10 minutes</strong>.</p>
          //   <p>If you did not request this, please ignore this message. Your account is safe.</p>
          //   <br />
          //   <p>Thanks,<br />The Coinkeeper Team</p>
          // </div>
          // `,
        });
        return { message: "OTP resent successfully" };
      } catch (error) {
        console.log(error);
        throw new Error(error.message || "Internal server error");
      }
    },
    forgotPassword: async (_, { email }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) throw new Error("Incorrect email");

        const newPassword = generatePassword(6);

        const transporter = getTransporter();

        const info = await transporter.sendMail({
          from: `<${process.env.NODEMAILER_USER_EMAIL}>`, // sender address
          to: email, // list of receivers
          subject: "Updated password", // Subject line
          text: "You this password to login", // plain text body
          html: `<h3>Your <b>${newPassword}</b> password to login</h3>`, // html body
        });

        const salt = await bcrypt.genSalt(10); // 10 means length of 10 chars
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;

        await user.save();

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

        const findUser = await User.findById({ _id: user._id });

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

        findUser.password = hashedPassword;

        await findUser.save();

        return { message: "Changed password successfully" };
      } catch (error) {
        console.log(error);
        throw new Error(error.message || "Internal server error");
      }
    },
    deleteUserAccount: async (_, __, context) => {
      try {
        const { req, res } = context;
        const user = await context.getUser();

        if (!user) throw new Error("unauthenticated");
        
        // Prevent deletion of specific email addresses
        const protectedEmails = ["pratikkamble522000@gmail.com"];
        if (protectedEmails.includes(user.email.toLowerCase())) {
          throw new Error("This account cannot be deleted for security reasons");
        }

        await User.findByIdAndDelete(user._id);
        await context.logout();

        req.session.destroy((err) => {
          if (err) throw err;
        });

        res.clearCookie("connect.sid");
        return { message: "Account deleted successfully" };
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
