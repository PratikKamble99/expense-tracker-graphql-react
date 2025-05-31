export const generateDataAnalysisPrompt = (input) => {
  return `
    Analyze the following array of transaction objects and generate a summary report for the last calendar month **in HTML format**.

    Please include:
    - Total Expenses
    - Total Income
    - Net Savings (Income - Expenses)
    - Top Spending Categories (with amounts)
    - Largest Single Expense (description and amount)
    - Total Number of Transactions
    - Breakdown of Payment Types (e.g., cash, card)
    - Optional: Visual summary using simple HTML tables or lists

    Each transaction object contains:
    - _id: string
    - userId: string
    - description: string
    - paymentType: "cash" | "card" | "bank"
    - category: "expense" | "income"
    - amount: number
    - location: string
    - date: timestamp in milliseconds
    - type: string (e.g., "housing:rent")

    ✅ **Expected Output:** A well-structured **HTML string** suitable for rendering in an email or web report.
    
    ⚠️ Only use data from **last calendar month** based on the date field.

    Use the following input data:
    ${JSON.stringify(input)}
  `;
};
