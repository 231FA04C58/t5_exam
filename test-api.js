const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

// Test function to demonstrate API usage
async function testAPI() {
  try {
    console.log('🧪 Testing E-commerce API...\n');

    // Test 1: Get all products
    console.log('1. Getting all products...');
    const productsResponse = await axios.get(`${BASE_URL}/products`);
    console.log(`✅ Found ${productsResponse.data.count} products`);
    
    if (productsResponse.data.data.length > 0) {
      const firstProduct = productsResponse.data.data[0];
      console.log(`   First product: ${firstProduct.name} - $${firstProduct.price}`);
    }

    // Test 2: Create a new order
    console.log('\n2. Creating a new order...');
    const orderData = {
      customerInfo: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        shippingAddress: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        }
      },
      items: [
        {
          productId: productsResponse.data.data[0].id,
          quantity: 1
        }
      ]
    };

    const orderResponse = await axios.post(`${BASE_URL}/orders`, orderData);
    console.log(`✅ Order created with ID: ${orderResponse.data.data.id}`);
    console.log(`   Total amount: $${orderResponse.data.data.totalAmount}`);
    console.log(`   Status: ${orderResponse.data.data.status}`);

    // Test 3: Update order status
    console.log('\n3. Updating order status...');
    const updateResponse = await axios.patch(`${BASE_URL}/orders/${orderResponse.data.data.id}/status`, {
      status: 'confirmed'
    });
    console.log(`✅ Order status updated to: ${updateResponse.data.data.status}`);

    // Test 4: Get order status
    console.log('\n4. Getting order status...');
    const statusResponse = await axios.get(`${BASE_URL}/orders/${orderResponse.data.data.id}/status`);
    console.log(`✅ Order status: ${statusResponse.data.data.status}`);

    // Test 5: Get orders by customer
    console.log('\n5. Getting orders by customer...');
    const customerOrdersResponse = await axios.get(`${BASE_URL}/orders/customer/john@example.com`);
    console.log(`✅ Found ${customerOrdersResponse.data.count} orders for customer`);

    console.log('\n🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = { testAPI };
