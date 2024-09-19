import { useState, useEffect } from "react";
import axios from "axios";
import Form from "./components/Form";
import Logo from "./components/Logo";
import PackingList from "./components/PackingList";
import Stats from "./components/Stats";

function App() {
  const [items, setItems] = useState([]);

  // Fetch items from backend when the component loads
  useEffect(() => {
    async function fetchItems() {
      try {
        const res = await axios.get("http://localhost:5000/api/items");

        setItems(res.data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    }
    fetchItems();
  }, []);

  // Add new item
  async function handleAddItem(item) {
    console.log("Adding item:", item);
    try {
      const res = await axios.post("http://localhost:5000/api/items", item);
      setItems((items) => [...items, res.data]);
    } catch (error) {
      console.error("Error adding item:", error);
    }
  }

  // Delete item
  async function handleDeleteItem(id) {
    try {
      await axios.delete(`http://localhost:5000/api/items/${id}`);
      setItems((items) => items.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  }

  // Toggle packed status
  async function handleToggleItem(id) {
    try {
      const item = items.find((item) => item._id === id);
      const updatedItem = { ...item, packed: !item.packed };
      const res = await axios.put(
        `http://localhost:5000/api/items/${id}`,
        updatedItem
      );
      setItems((items) =>
        items.map((item) => (item._id === id ? res.data : item))
      );
    } catch (error) {
      console.error("Error updating item:", error);
    }
  }

  // Clear the list
  async function handleClearList() {
    const confirmed = window.confirm(
      "Are you sure you want to clear the list?"
    );
    if (confirmed) {
      try {
        await axios.delete("http://localhost:5000/api/items");
        setItems([]);
      } catch (error) {
        console.error("Error clearing items:", error);
      }
    }
  }

  return (
    <div className="app">
      <Logo />
      <Form onAddItem={handleAddItem} />
      <PackingList
        items={items}
        onDeleteItem={handleDeleteItem}
        onToggleItem={handleToggleItem}
        onClearList={handleClearList}
      />
      <Stats items={items} />
    </div>
  );
}

export default App;
