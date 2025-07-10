import cron from "node-cron";
import User from "../models/user.model.js";

// // Schedule: At 00:00 on the 1st day of every month
// // ┌───────────── minute (0)
// // │ ┌─────────── hour (0)
// // │ │ ┌───────── day of month (1)
// // │ │ │ ┌─────── month (* = every month)
// // │ │ │ │ ┌───── day of week (* = every day) // type: mon, thue, wed, thu, fri, sat, sun
// // │ │ │ │ │ |
// // 0 0 1 * * *

// // Seconds (0-59): The first * means "every second."
// // Minutes (0-59): The second * means "every minute."
// // Hours (0-23): The third * means "every hour."
// // Day of Month (1-31): The fourth * means "every day of the month."
// // Month (1-12): The fifth * means "every month."
// // Day of Week (0-7, 0 or 7 is Sunday): The sixth * means "every day of the week."

// import dotenv from "dotenv";
import { emailQueueProducer } from "../queue/emailQueue.js";

// dotenv.config();

export const emailCron = () => {
  cron.schedule("0 0 0 1 * 0", async () => {
    const users = await User.find({}).select("email name");

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      emailQueueProducer(user);
    }
  });
};
