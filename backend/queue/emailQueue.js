import { Queue, Worker } from "bullmq";
import { redisConnection } from "../redis/config.js";
import ModelClient from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import Transaction from "../models/transaction.model.js";
import { generateDataAnalysisPrompt } from "../utils/prompts.js";
import { getTransporter } from "../mail-service/sendMail.js";
import { DateTime } from "luxon";

const token = process.env.TOKEN;
const endpoint = process.env.ENDPOINT;
const model1 = process.env.MODEL;
const client = ModelClient(endpoint, new AzureKeyCredential(token));

// Queue setup
const emailQueue = new Queue("email-queue", {
  connection: redisConnection,
});

// Worker to process job
const emailWorker = new Worker(
  "email-queue",
  async (job) => {
    try {
      const { user } = job.data;
      console.log(`📩 Processing report for ${user.email}`);

      const now = DateTime.now();
      const startOfLastMonth = now.minus({ months: 1 }).startOf("month");
      const endOfLastMonth = now.minus({ months: 1 }).endOf("month");

      const transactions = await Transaction.find({
        userId: user._id,
        date: {
          $gte: startOfLastMonth.toMillis(),
          $lte: endOfLastMonth.toMillis(),
        },
      }).select("description paymentType category amount location date");

      const aiResponse = await client.path("/chat/completions").post({
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
        aiResponse.body?.choices?.[0]?.message?.content ||
        "No analysis available";

      // Sanitize markdown-formatted HTML
      rawHTML = rawHTML.replace(/^```html|```$/g, "").trim();

      const transporter = getTransporter();

      await transporter.sendMail({
        to: user.email,
        subject: "📊 Your Monthly Expense Analysis Report",
        html: `
          <h2>Hello ${user.name || "User"},</h2>
          <p>Here’s your personalized expense report for last month:</p>
          ${rawHTML}
          <p>Best regards,<br/>The Finance AI Team</p>
        `,
      });

      console.log(`✅ Report sent to ${user.email}`);
    } catch (error) {
      console.error("❌ Failed to process email job:", error);
    }
  },
  {
    connection: redisConnection,
  }
);

// Queue producer function
export const emailQueueProducer = async (user) => {
  try {
    await emailQueue.add("send-analytics-email", { user }, { attempts: 2 });
    console.log(`📬 Job queued for ${user.email}`);
  } catch (error) {
    console.error("❌ Failed to queue email job:", error);
  }
};
