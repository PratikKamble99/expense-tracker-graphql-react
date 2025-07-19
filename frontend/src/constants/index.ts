export const SIDEBAR_WIDTH = "16rem";

export const TRANSACITON_TYPES = ["INCOME", "EXPENSE", "INVESTMENT"];


export const CATEGORY_OPTIONS = [
  {
    label: "Income",
    options: [
      { value: "income:salary", label: "Salary / Wages" },
      { value: "income:freelance", label: "Freelance / Contract" },
      { value: "income:business", label: "Business Income" },
      { value: "income:interest", label: "Interest / Dividends" },
      { value: "income:refunds", label: "Refunds / Reimbursements" },
      { value: "income:others", label: "Other Income" },
    ]
  },
    {
      label: "Personal",
      options: [
        { value: "personal:food", label: "Food & Dining" },
        { value: "personal:clothing", label: "Clothing & Shoes" },
        { value: "personal:fitness", label: "Fitness (e.g. Gym, Protein)" },
        { value: "personal:entertainment", label: "Entertainment (Movies, OTT)" },
        { value: "personal:travel", label: "Travel & Vacation" },
        { value: "personal:healthcare", label: "Healthcare & Medical" },
        { value: "personal:education", label: "Education & Courses" },
        { value: "personal:personal_care", label: "Personal Care (Salon, Toiletries)" },
        { value: "personal:subscriptions", label: "Subscriptions (Netflix, Spotify)" },
        { value: "personal:other", label: "Other Personal Expenses" },
      ],
    },
    {
      label: "Housing",
      options: [
        { value: "housing:rent", label: "Rent / Mortgage" },
        { value: "housing:utilities:electricity", label: "Electricity" },
        { value: "housing:utilities:water", label: "Water" },
        { value: "housing:utilities:internet", label: "Internet / WiFi" },
        { value: "housing:utilities:gas", label: "Gas / Cooking" },
        { value: "housing:repairs", label: "Home Repairs & Maintenance" },
      ],
    },
    {
      label: "Transportation",
      options: [
        { value: "transportation:fuel", label: "Fuel / Gasoline" },
        { value: "transportation:public", label: "Public Transport" },
        { value: "transportation:maintenance", label: "Vehicle Maintenance" },
        { value: "transportation:insurance", label: "Auto Insurance" },
        { value: "transportation:parking", label: "Parking & Tolls" },
      ],
    },
    {
      label: "Financial",
      options: [
        { value: "financial:loan", label: "Loan Payments" },
        { value: "financial:insurance", label: "Health / Life Insurance" },
        { value: "financial:credit_card", label: "Credit Card Payments" },
        { value: "financial:investment", label: "Investments / SIPs" },
        { value: "financial:tax", label: "Taxes & Filing" },
      ],
    },
    {
      label: "Transfer",
      options: [
        { value: "transfer:home_support", label: "Sent to Family / Home" },
        { value: "transfer:friends", label: "Sent to Friends" },
        { value: "transfer:savings", label: "Transferred to Savings" },
      ],
    },
  ];