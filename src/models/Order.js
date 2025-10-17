const { v4: uuidv4 } = require('uuid');

// Order status enum
const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

class OrderItem {
  constructor(productId, quantity, price) {
    this.productId = productId;
    this.quantity = quantity;
    this.price = price;
    this.subtotal = quantity * price;
  }
}

class Order {
  constructor(customerInfo, items) {
    this.id = uuidv4();
    this.customerInfo = customerInfo;
    this.items = items.map(item => new OrderItem(item.productId, item.quantity, item.price));
    this.status = ORDER_STATUS.PENDING;
    this.totalAmount = this.calculateTotal();
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
    this.shippingAddress = customerInfo.shippingAddress || null;
    this.trackingNumber = null;
  }

  calculateTotal() {
    return this.items.reduce((total, item) => total + item.subtotal, 0);
  }

  updateStatus(newStatus) {
    if (!Object.values(ORDER_STATUS).includes(newStatus)) {
      throw new Error('Invalid order status');
    }
    this.status = newStatus;
    this.updatedAt = new Date().toISOString();
  }

  addTrackingNumber(trackingNumber) {
    this.trackingNumber = trackingNumber;
    this.updatedAt = new Date().toISOString();
  }

  updateShippingAddress(address) {
    this.shippingAddress = address;
    this.updatedAt = new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      customerInfo: this.customerInfo,
      items: this.items,
      status: this.status,
      totalAmount: this.totalAmount,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      shippingAddress: this.shippingAddress,
      trackingNumber: this.trackingNumber
    };
  }
}

// In-memory storage for orders
let orders = [];

module.exports = { Order, OrderItem, ORDER_STATUS, orders };
