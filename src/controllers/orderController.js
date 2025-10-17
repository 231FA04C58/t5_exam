const { Order, ORDER_STATUS, orders } = require('../models/Order');
const { products } = require('../models/Product');
const Joi = require('joi');


const customerInfoSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(10).max(20).required(),
  shippingAddress: Joi.object({
    street: Joi.string().min(1).max(200).required(),
    city: Joi.string().min(1).max(100).required(),
    state: Joi.string().min(1).max(100).required(),
    zipCode: Joi.string().min(1).max(20).required(),
    country: Joi.string().min(1).max(100).required()
  }).required()
});

const orderItemSchema = Joi.object({
  productId: Joi.string().uuid().required(),
  quantity: Joi.number().integer().min(1).required()
});

const createOrderSchema = Joi.object({
  customerInfo: customerInfoSchema.required(),
  items: Joi.array().items(orderItemSchema).min(1).required()
});


const getAllOrders = (req, res) => {
  try {
    const { status, customerEmail } = req.query;
    let filteredOrders = [...orders];

    if (status) {
      filteredOrders = filteredOrders.filter(order => 
        order.status.toLowerCase() === status.toLowerCase()
      );
    }

    
    if (customerEmail) {
      filteredOrders = filteredOrders.filter(order => 
        order.customerInfo.email.toLowerCase() === customerEmail.toLowerCase()
      );
    }

    res.json({
      success: true,
      data: filteredOrders,
      count: filteredOrders.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};


const getOrderById = (req, res) => {
  try {
    const { id } = req.params;
    const order = orders.find(o => o.id === id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
};


const createOrder = (req, res) => {
  try {
    const { error, value } = createOrderSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.details[0].message
      });
    }

    // Validate products exist and have sufficient stock
    const validatedItems = [];
    for (const item of value.items) {
      const product = products.find(p => p.id === item.productId);
      
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product with ID ${item.productId} not found`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`
        });
      }

      validatedItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price
      });
    }

    // Create order
    const order = new Order(value.customerInfo, validatedItems);
    orders.push(order);

    // Update product stock
    for (const item of validatedItems) {
      const product = products.find(p => p.id === item.productId);
      product.updateStock(product.stock - item.quantity);
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
};

// Update order status
const updateOrderStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber } = req.body;

    if (!status || !Object.values(ORDER_STATUS).includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status is required'
      });
    }

    const orderIndex = orders.findIndex(o => o.id === id);

    if (orderIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    orders[orderIndex].updateStatus(status);

    // Add tracking number if provided
    if (trackingNumber) {
      orders[orderIndex].addTrackingNumber(trackingNumber);
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: orders[orderIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
};

// Cancel order
const cancelOrder = (req, res) => {
  try {
    const { id } = req.params;
    const orderIndex = orders.findIndex(o => o.id === id);

    if (orderIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = orders[orderIndex];

    // Only allow cancellation of pending or confirmed orders
    if (order.status === ORDER_STATUS.SHIPPED || order.status === ORDER_STATUS.DELIVERED) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel order that has been shipped or delivered'
      });
    }

    // Restore product stock
    for (const item of order.items) {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        product.updateStock(product.stock + item.quantity);
      }
    }

    order.updateStatus(ORDER_STATUS.CANCELLED);

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling order',
      error: error.message
    });
  }
};

// Get order status
const getOrderStatus = (req, res) => {
  try {
    const { id } = req.params;
    const order = orders.find(o => o.id === id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: order.id,
        status: order.status,
        trackingNumber: order.trackingNumber,
        updatedAt: order.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order status',
      error: error.message
    });
  }
};

// Get orders by customer email
const getOrdersByCustomer = (req, res) => {
  try {
    const { email } = req.params;
    const customerOrders = orders.filter(order => 
      order.customerInfo.email.toLowerCase() === email.toLowerCase()
    );

    res.json({
      success: true,
      data: customerOrders,
      count: customerOrders.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching customer orders',
      error: error.message
    });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  getOrderStatus,
  getOrdersByCustomer
};
