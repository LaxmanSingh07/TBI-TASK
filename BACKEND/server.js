const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error:", error));

const itemSchema = new mongoose.Schema({
  description: { type: String, required: true }, // Changed to 'description' to match the frontend
  quantity: { type: Number, required: true, default: 1 },
  packed: { type: Boolean, default: false },
});

const Item = mongoose.model("Item", itemSchema);

app.get("/api/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/items", async (req, res) => {
  const { description, quantity, packed } = req.body;

  if (!description || quantity === undefined || packed === undefined) {
    return res
      .status(400)
      .json({ error: "Description, quantity, and packed status are required" });
  }

  const newItem = new Item({ description, quantity, packed });

  try {
    await newItem.save();
    res.json(newItem);
  } catch (error) {
    console.error("Error saving item:", error);
    res.status(500).json({ error: "Database error" });
  }
});

app.delete("/api/items/:id", async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted" });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/api/items/:id", async (req, res) => {
  const { description, quantity, packed } = req.body;

  try {
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      { description, quantity, packed },
      { new: true }
    );
    res.json(updatedItem);
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/api/items", async (req, res) => {
  try {
    await Item.deleteMany();
    res.json({ message: "All items cleared" });
  } catch (error) {
    console.error("Error clearing items:", error);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
