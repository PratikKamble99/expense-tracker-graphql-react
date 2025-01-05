import React, { useState } from "react";

const TransactionFilters = ({ onFilterChange }: any) => {
  const [filters, setFilters] = useState({
    category: "All",
    paymentType: "All",
    location: "All",
    dateRange: { start: "", end: "" },
    search: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-gray-800 text-white">
      {/* Category Filter */}
      <select
        name="category"
        value={filters.category}
        onChange={handleInputChange}
        className="p-2 bg-gray-700 border border-gray-600 rounded"
      >
        <option value="All">All Categories</option>
        <option value="expense">Expense</option>
        <option value="investment">Investment</option>
        <option value="income">Income</option>
      </select>

      {/* Payment Type Filter */}
      <select
        name="paymentType"
        value={filters.paymentType}
        onChange={handleInputChange}
        className="p-2 bg-gray-700 border border-gray-600 rounded"
      >
        <option value="All">All Payment Types</option>
        <option value="card">Card</option>
        <option value="cash">Cash</option>
        <option value="upi">UPI</option>
      </select>

      {/* Location Filter */}
      <select
        name="location"
        value={filters.location}
        onChange={handleInputChange}
        className="p-2 bg-gray-700 border border-gray-600 rounded"
      >
        <option value="All">All Locations</option>
        <option value="Home">Home</option>
        <option value="Office">Office</option>
        <option value="Other">Other</option>
      </select>

      {/* Date Range Picker */}
      <div className="flex gap-2">
        <input
          type="date"
          name="startDate"
          value={filters.dateRange.start}
          onChange={(e) =>
            handleInputChange({
              target: {
                name: "dateRange",
                value: { ...filters.dateRange, start: e.target.value },
              },
            })
          }
          className="p-2 bg-gray-700 border border-gray-600 rounded"
        />
        <input
          type="date"
          name="endDate"
          value={filters.dateRange.end}
          onChange={(e) =>
            handleInputChange({
              target: {
                name: "dateRange",
                value: { ...filters.dateRange, end: e.target.value },
              },
            })
          }
          className="p-2 bg-gray-700 border border-gray-600 rounded"
        />
      </div>

      {/* Search Bar */}
      <input
        type="text"
        name="search"
        placeholder="Search..."
        value={filters.search}
        onChange={handleInputChange}
        className="p-2 bg-gray-700 border border-gray-600 rounded w-full"
      />

      {/* Clear Filters Button */}
      <button
        onClick={() => {
          const resetFilters = {
            category: "All",
            paymentType: "All",
            location: "All",
            dateRange: { start: "", end: "" },
            search: "",
          };
          setFilters(resetFilters);
          onFilterChange(resetFilters);
        }}
        className="p-2 bg-red-600 text-white rounded"
      >
        Clear Filters
      </button>
    </div>
  );
};

export default TransactionFilters;
