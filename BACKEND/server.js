const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Define Item Schema and Model
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  packed: { type: Boolean, default: false },
});

const Item = mongoose.model("Item", itemSchema);

// Get all items
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
  const { name, packed } = req.body;

  if (!name || packed === undefined) {
    return res
      .status(400)
      .json({ error: "Name and packed status are required" });
  }

  const newItem = new Item({ name, packed });
  console.log("Received data:", req.body);

  try {
    await newItem.save();
    console.log("New item saved:", newItem);
    res.json(newItem);
  } catch (error) {
    console.error("Error saving item:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// Delete an item by ID
app.delete("/api/items/:id", async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted" });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update an item's packed status by ID
app.put("/api/items/:id", async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedItem);
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
