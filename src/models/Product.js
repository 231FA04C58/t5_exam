const { v4: uuidv4 } = require('uuid');

class Product {
  constructor(name, description, price, category, stock = 0) {
    this.id = uuidv4();
    this.name = name;
    this.description = description;
    this.price = price;
    this.category = category;
    this.stock = stock;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  updateStock(newStock) {
    this.stock = newStock;
    this.updatedAt = new Date().toISOString();
  }

  updateProduct(updates) {
    Object.keys(updates).forEach(key => {
      if (key !== 'id' && key !== 'createdAt') {
        this[key] = updates[key];
      }
    });
    this.updatedAt = new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      price: this.price,
      category: this.category,
      stock: this.stock,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

// In-memory storage for products
let products = [
  new Product(
    "Wireless Bluetooth Headphones",
    "High-quality wireless headphones with noise cancellation",
    99.99,
    "Electronics",
    50
  ),
  new Product(
    "Organic Cotton T-Shirt",
    "Comfortable and sustainable cotton t-shirt",
    29.99,
    "Clothing",
    100
  ),
  new Product(
    "Smartphone Case",
    "Protective case for smartphones with wireless charging support",
    19.99,
    "Electronics",
    75
  ),
  new Product(
    "Coffee Mug",
    "Ceramic coffee mug with heat retention",
    12.99,
    "Home & Kitchen",
    200
  ),
  new Product(
    "Running Shoes",
    "Lightweight running shoes with excellent cushioning",
    89.99,
    "Footwear",
    30
  )
];

module.exports = { Product, products };
