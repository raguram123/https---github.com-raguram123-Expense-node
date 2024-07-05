const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv")
 
const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;
 
app.use(cors());
app.use(express.json());
 
// Connect to MongoDB
const url = process.env.URL ;
mongoose.connect(url, {})
        .then(()=>console.log("Connected to MongoDB"))
        .catch((err)=>console.log("Failed to Connect ",err));
 
// Expense schema
const expenseSchema = new mongoose.Schema({
    description: { type: String, required: true },
    amount: { type: Number, required: true },
});
 
const Expense = mongoose.model("Expense", expenseSchema);
 
// API routes
app.get("/expenses", async (req, res) => {
    try {
        const expenses = await Expense.find();
        res.json(expenses);
    } catch (error) {
        console.error("Error fetching expenses:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
 
app.post("/expenses", async (req, res) => {
    const { description, amount } = req.body;
 
    try {
        if (!description || !amount) {
            return res
                .status(400)
                .json({ message: "Description and amount are required." });
        }
 
        const newExpense = new Expense({ description, amount });
        await newExpense.save();
        res.json(newExpense);
    } catch (error) {
        console.error("Error saving expense:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});