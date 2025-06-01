import cron from "node-cron";
import User from "../models/user.model.js";

// Schedule: At 00:00 on the 1st day of every month
// ┌───────────── minute (0)
// │ ┌─────────── hour (0)
// │ │ ┌───────── day of month (1)
// │ │ │ ┌─────── month (* = every month)
// │ │ │ │ ┌───── day of week (* = every day) // type: mon, thue, wed, thu, fri, sat, sun
// │ │ │ │ │
// 0 0 1 * *

import dotenv from "dotenv";
import { emailQueueProducer } from "../queue/emailQueue.js";

dotenv.config();

export const emailCron = () => {
  cron.schedule("0 0 1 * *", async () => {
    const users = await User.find({}).select("email name");

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      emailQueueProducer(user);
    }
  });
};
