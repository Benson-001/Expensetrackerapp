const mongoose = require("mongoose");
const { type } = require("os");

const ExpenseSchema = mongoose.Schema({
  label: { type: String, require: true },
  value: { type: Number, require: true },
  date: { type: String, require: true },
});

module.exports = mongoose.model("Expense", ExpenseSchema);
