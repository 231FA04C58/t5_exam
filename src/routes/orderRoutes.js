const express = require('express');
const router = express.Router();
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  getOrderStatus,
  getOrdersByCustomer
} = require('../controllers/orderController');

// GET /api/orders - Get all orders
router.get('/', getAllOrders);

// GET /api/orders/:id - Get order by ID
router.get('/:id', getOrderById);

// GET /api/orders/:id/status - Get order status
router.get('/:id/status', getOrderStatus);

// GET /api/orders/customer/:email - Get orders by customer email
router.get('/customer/:email', getOrdersByCustomer);

// POST /api/orders - Create new order
router.post('/', createOrder);

// PATCH /api/orders/:id/status - Update order status
router.patch('/:id/status', updateOrderStatus);

// DELETE /api/orders/:id - Cancel order
router.delete('/:id', cancelOrder);

module.exports = router;
