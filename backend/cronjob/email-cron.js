import cron from "node-cron";
import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import User from "../models/user.model.js";
import Transaction from "../models/transaction.model.js";
// Schedule: At 00:00 on the 1st day of every month
// ┌───────────── minute (0)
// │ ┌─────────── hour (0)
// │ │ ┌───────── day of month (1)
// │ │ │ ┌─────── month (* = every month)
// │ │ │ │ ┌───── day of week (* = every day)
// │ │ │ │ │
// 0 0 1 * *

export const token = "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";
export const endpoint = "https://models.github.ai/inference";
export const model1 = "openai/gpt-4.1";
export const client = ModelClient(endpoint, new AzureKeyCredential(token));

export const emailCron = () => {
  cron.schedule("0 0 1 * *", async () => {
    const users = await User.find({}).select("email name");

    const now = DateTime.now();

    const startOfLastMonth = now.minus({ months: 1 }).startOf("month");
    const endOfLastMonth = now.minus({ months: 1 }).endOf("month");

    for (let i = 0; i < users.length; i++) {
      const user = users[i];

      const transactions = await Transaction.find({
        userId: user._id,
        date: {
          $gte: startOfLastMonth.toString(),
          $lte: endOfLastMonth.toString(),
        },
      }).select("description paymentType category amount location date");

      const response = await client.path("/chat/completions").post({
        body: {
          messages: [
            {
              role: "user",
              content: generateDataAnalysisPrompt(transactions),
            },
          ],
          temperature: 1,
          top_p: 1,
          model: model1,
        },
      });

      let rawHTML =
        response.body?.choices?.[0]?.message?.content ||
        "No analysis available";

      if (rawHTML.startsWith("```html")) {
        rawHTML = rawHTML
          .replace(/^```html\s*/, "")
          .replace(/```$/, "")
          .trim();
      } else if (rawHTML.startsWith("```")) {
        rawHTML = rawHTML
          .replace(/^```\s*/, "")
          .replace(/```$/, "")
          .trim();
      }

      const transporter = getTransporter();

      const info = await transporter.sendMail({
        to: user.email,
        subject: "Your Monthly Expense Analysis Report",
        html: `
          <h2>Hello ${user.name || "User"},</h2>
          <p>Please find below your expense analysis report for last month:</p>
          ${rawHTML}
          <p>Best regards,<br/>The Team</p>
        `,
      });
    }
  });
};
