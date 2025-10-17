# E-commerce API

A simple RESTful API for managing products and customer orders in an e-commerce platform.

## Features

- **Product Management**: View, create, update, and delete products
- **Order Management**: Create and manage customer orders
- **Order Status Tracking**: Track order status from pending to delivered
- **Stock Management**: Automatic stock updates when orders are placed
- **Customer Order History**: View all orders for a specific customer
- **Input Validation**: Comprehensive validation using Joi
- **Error Handling**: Proper error responses and status codes

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone or download this project
2. Navigate to the project directory:
   ```bash
   cd ecommerce-api
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the server:
   ```bash
   npm start
   ```
   
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

5. The API will be available at `http://localhost:3000`

## API Endpoints

### Health Check
- `GET /health` - Check if the API is running

### Products

#### Get All Products
```
GET /api/products
```
Query parameters:
- `category` - Filter by category
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `inStock` - Filter by stock availability (true/false)

#### Get Product by ID
```
GET /api/products/:id
```

#### Create Product
```
POST /api/products
```
Body:
```json
{
  "name": "Product Name",
  "description": "Product description",
  "price": 99.99,
  "category": "Electronics",
  "stock": 50
}
```

#### Update Product
```
PUT /api/products/:id
```

#### Delete Product
```
DELETE /api/products/:id
```

#### Update Product Stock
```
PATCH /api/products/:id/stock
```
Body:
```json
{
  "stock": 100
}
```

### Orders

#### Get All Orders
```
GET /api/orders
```
Query parameters:
- `status` - Filter by order status
- `customerEmail` - Filter by customer email

#### Get Order by ID
```
GET /api/orders/:id
```

#### Get Order Status
```
GET /api/orders/:id/status
```

#### Get Orders by Customer
```
GET /api/orders/customer/:email
```

#### Create Order
```
POST /api/orders
```
Body:
```json
{
  "customerInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "shippingAddress": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    }
  },
  "items": [
    {
      "productId": "product-uuid-here",
      "quantity": 2
    }
  ]
}
```

#### Update Order Status
```
PATCH /api/orders/:id/status
```
Body:
```json
{
  "status": "shipped",
  "trackingNumber": "TRK123456789"
}
```

#### Cancel Order
```
DELETE /api/orders/:id
```

## Order Status Flow

Orders progress through the following statuses:

1. **pending** - Order created, awaiting confirmation
2. **confirmed** - Order confirmed and being processed
3. **processing** - Order is being prepared
4. **shipped** - Order has been shipped
5. **delivered** - Order has been delivered
6. **cancelled** - Order has been cancelled

## Sample Data

The API comes with pre-loaded sample products:

- Wireless Bluetooth Headphones ($99.99)
- Organic Cotton T-Shirt ($29.99)
- Smartphone Case ($19.99)
- Coffee Mug ($12.99)
- Running Shoes ($89.99)

## Response Format

All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

## Error Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error

## Development

### Project Structure
```
ecommerce-api/
├── src/
│   ├── controllers/
│   │   ├── productController.js
│   │   └── orderController.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── productRoutes.js
│   │   └── orderRoutes.js
│   └── server.js
├── package.json
└── README.md
```

### Dependencies

**Production:**
- `express` - Web framework
- `cors` - Cross-origin resource sharing
- `helmet` - Security middleware
- `morgan` - HTTP request logger
- `uuid` - UUID generation
- `joi` - Data validation

**Development:**
- `nodemon` - Development server with auto-restart
- `jest` - Testing framework
- `supertest` - HTTP assertion library

## Testing

Run tests with:
```bash
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
