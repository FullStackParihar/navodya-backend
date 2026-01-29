# API Documentation

Base URL: `http://localhost:3000/api`

## Authentication Endpoints

### Register User
Creates a new user account with the provided details. Returns a JWT token and user information.
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890" // optional
}
```

**Response:**
```json
{
  "success": true,
  "statusCode": 201,
  "data": {
    "user": {
      "id": "uuid",
      "email": "john@example.com",
      "name": "John Doe",
      "phone": "+1234567890",
      "avatar": null,
      "role": "user"
    },
    "token": "jwt-token"
  },
  "message": "User registered successfully"
}
```

### Login
Authenticates a user using email and password. Returns a JWT token for accessing protected routes.
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Profile (Authenticated)
Retrieves the profile information of the currently authenticated user.
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

### Update Profile (Authenticated)
Updates the profile details (name, phone, avatar) of the currently logged-in user.
```http
PATCH /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Smith",
  "phone": "+1987654321",
  "avatar": "https://example.com/avatar.jpg"
}
```

### Logout (Authenticated)
Invalidates the current session (client-side action usually, but included for completeness).
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

## Product Endpoints

### Get All Products
Retrieves a paginated list of products with support for filtering by category, price, size, color, search query, and sorting.
```http
GET /api/products?category=men&size=M&minPrice=299&maxPrice=999&sort=price_asc&page=1&limit=20
```

**Query Parameters:**
- `category` - Filter by category slug
- `subcategory` - Filter by subcategory
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `size` - Filter by size
- `color` - Filter by color
- `tags` - Comma-separated tags
- `search` - Search in name/description
- `sort` - Sort field (price_asc, price_desc, created_at, rating)
- `order` - Sort order (asc, desc)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

### Get Product by Slug
Retrieves detailed information about a specific product using its unique slug.
```http
GET /api/products/blue-tshirt
```

### Create Product (Admin Only)
Creates a new product in the catalog. Requires Admin privileges.
```http
POST /api/products
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Blue T-Shirt",
  "slug": "blue-tshirt",
  "description": "Comfortable cotton t-shirt",
  "price": 499,
  "salePrice": 399,
  "images": ["https://example.com/image1.jpg"],
  "categoryId": "category-uuid",
  "subcategory": "T-Shirts",
  "sizes": [
    { "size": "S", "stock": 10 },
    { "size": "M", "stock": 15 },
    { "size": "L", "stock": 20 }
  ],
  "colors": [
    {
      "name": "Blue",
      "hex": "#0000FF",
      "images": ["https://example.com/blue.jpg"]
    }
  ],
  "tags": ["casual", "summer"]
}
```

### Update Product (Admin Only)
Updates an existing product's details. Partial updates are supported. Requires Admin privileges.
```http
PATCH /api/products/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "price": 449,
  "salePrice": 349,
  "isActive": true
}
```

### Delete Product (Admin Only)
Permanently deletes a product from the catalog. Requires Admin privileges.
```http
DELETE /api/products/:id
Authorization: Bearer <admin-token>
```

## Category Endpoints

### Get All Categories
Retrieves a list of all product categories.
```http
GET /api/categories
```

### Get Category by Slug
Retrieves details of a specific category using its slug.
```http
GET /api/categories/men
```

### Create Category (Admin Only)
Creates a new product category. Requires Admin privileges.
```http
POST /api/categories
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Men",
  "slug": "men",
  "description": "Men's clothing and accessories",
  "image": "https://example.com/men.jpg"
}
```

### Update Category (Admin Only)
Updates an existing category. Requires Admin privileges.
```http
PATCH /api/categories/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Men's Collection",
  "description": "Updated description"
}
```

### Delete Category (Admin Only)
Permanently deletes a category. Requires Admin privileges.
```http
DELETE /api/categories/:id
Authorization: Bearer <admin-token>
```

## Cart Endpoints (All Authenticated)

### Get Cart
Retrieves the current user's shopping cart items and summary (subtotal, total quantity).
```http
GET /api/cart
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "quantity": 2,
        "size": "M",
        "color": "Blue",
        "products": {
          "id": "uuid",
          "name": "Blue T-Shirt",
          "price": 499,
          "sale_price": 399,
          "images": [...]
        }
      }
    ],
    "summary": {
      "itemCount": 1,
      "totalQuantity": 2,
      "subtotal": 798
    }
  }
}
```

### Add to Cart
Adds a product to the user's cart. If the item exists, it updates the quantity (checking stock limits).
```http
POST /api/cart/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "product-uuid",
  "quantity": 2,
  "size": "M",
  "color": "Blue"
}
```

### Update Cart Item (Bulk Quantity Support)
Updates the quantity of a specific item in the cart.
```http
PATCH /api/cart/update/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 5
}
```

### Remove from Cart
Removes a specific item from the shopping cart.
```http
DELETE /api/cart/remove/:id
Authorization: Bearer <token>
```

### Clear Cart
Removes all items from the user's shopping cart.
```http
POST /api/cart/clear
Authorization: Bearer <token>
```

## Favorites Endpoints (All Authenticated)

### Get Favorites
Retrieves the list of products marked as favorite by the user.
```http
GET /api/favorites
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "favorites": [...],
    "count": 5
  }
}
```

### Toggle Favorite
Adds or removes a product from the user's favorites list.
```http
POST /api/favorites/toggle/:productId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "isFavorite": true,
    "favorite": {...}
  }
}
```

### Remove Favorite
Explicitly removes a product from favorites.
```http
DELETE /api/favorites/:productId
Authorization: Bearer <token>
```

### Check Favorite Status
Checks if a specific product is in the user's favorites list.
```http
GET /api/favorites/check/:productId
Authorization: Bearer <token>
```

## Coupon Endpoints

### Create Coupon (Admin Only)
Creates a new discount coupon. Requires Admin privileges.
```http
POST /api/coupons
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "code": "SUMMER50",
  "type": "PERCENTAGE",
  "value": 50,
  "minOrderAmount": 1000,
  "maxDiscountAmount": 500,
  "validUntil": "2024-12-31T23:59:59Z",
  "usageLimit": 100
}
```

### Validate Coupon (Authenticated)
Checks if a coupon code is valid for a given order amount and returns the discount details.
```http
POST /api/coupons/validate
Authorization: Bearer <token>
Content-Type: application/json

{
  "code": "SUMMER50",
  "orderAmount": 1500
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "couponCode": "SUMMER50",
    "discountAmount": 500,
    "message": "Coupon applied successfully"
  }
}
```

## Order & Payment Endpoints

### Create Payment Intent (Authenticated)
Initiates a payment session with Stripe. Calculates final order total including coupons and returns the client secret for the frontend.
```http
POST /api/orders/create-payment-intent
Authorization: Bearer <token>
Content-Type: application/json

{
  "couponCode": "SUMMER50",
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "MH",
    "zip_code": "400001",
    "country": "India"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "clientSecret": "pi_..._secret_...",
    "paymentIntentId": "pi_...",
    "pricing": {
      "subtotal": 1500,
      "discount": 500,
      "shippingFee": 0,
      "tax": 0,
      "total": 1000
    }
  }
}
```

### Create Order (Authenticated)
Finalizes the order after successful payment. Verifies payment status, updates stock, clears cart, and creates the order record.
```http
POST /api/orders/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "paymentIntentId": "pi_...",
  "shippingAddress": { ... }
}
```

### Get My Orders (Authenticated)
Retrieves a history of past orders placed by the user.
```http
GET /api/orders
Authorization: Bearer <token>
```

## Error Response Format


All errors follow this format:
```json
{
  "success": false,
  "message": "Error message here"
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (admin access required)
- `404` - Not Found
- `500` - Internal Server Error

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

The token is returned when you register or login and expires after 7 days by default.
