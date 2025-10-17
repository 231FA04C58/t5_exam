// app.js
const express = require("express");
const app = express();

app.use(express.json());

// Enable CORS for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

const products = [
  { id: 1, name: "Laptop", price: 60000 },
  { id: 2, name: "Headphones", price: 2000 },
];

const orders = [];

// 1. View all products
app.get("/api/products", (req, res) => {
  res.json(products);
});

// 2. Create an order
app.post("/api/orders", (req, res) => {
  const { customerName, productId } = req.body;
  const product = products.find((p) => p.id === productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const newOrder = {
    id: orders.length + 1,
    customerName,
    product,
    status: "Pending",
  };

  orders.push(newOrder);
  res.status(201).json(newOrder);
});

// 3. Track order status
app.get("/api/orders/:id", (req, res) => {
  const order = orders.find((o) => o.id === parseInt(req.params.id));
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
});

app.listen(5000, () => console.log("Server running on port 5000"));
