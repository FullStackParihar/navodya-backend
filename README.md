# E-commerce Backend API

A comprehensive e-commerce backend built with Express.js, TypeScript, and Supabase.

## Features

- **Authentication System**: Register, login, profile management with JWT
- **Product Management**: Full CRUD operations with advanced filtering
- **Cart System**: Bulk quantity support with real-time stock validation
- **Favorites/Wishlist**: Toggle favorites for products
- **Categories**: Organized product categorization
- **Secure**: Row Level Security (RLS) policies on all database tables

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod
- **Password Hashing**: bcryptjs

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account and project

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Configure your `.env` file with Supabase credentials

4. Start development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
npm start
```

## API Endpoints

### Authentication (`/api/auth`)

- `POST /register` - Register new user
- `POST /login` - Login user
- `POST /logout` - Logout user
- `GET /profile` - Get user profile (authenticated)
- `PATCH /profile` - Update profile (authenticated)

### Products (`/api`)

- `GET /products` - Get all products with filtering
  - Query params: `category`, `subcategory`, `minPrice`, `maxPrice`, `size`, `color`, `tags`, `search`, `sort`, `order`, `page`, `limit`
- `GET /products/:slug` - Get product by slug
- `POST /products` - Create product (admin only)
- `PATCH /products/:id` - Update product (admin only)
- `DELETE /products/:id` - Delete product (admin only)

### Categories (`/api`)

- `GET /categories` - Get all categories
- `GET /categories/:slug` - Get category by slug
- `POST /categories` - Create category (admin only)
- `PATCH /categories/:id` - Update category (admin only)
- `DELETE /categories/:id` - Delete category (admin only)

### Cart (`/api/cart`)

- `GET /` - Get cart with totals
- `POST /add` - Add item to cart
- `PATCH /update/:id` - Update item quantity
- `DELETE /remove/:id` - Remove item from cart
- `POST /clear` - Clear entire cart

### Favorites (`/api/favorites`)

- `GET /` - Get all favorites
- `POST /toggle/:productId` - Toggle favorite
- `DELETE /:productId` - Remove from favorites
- `GET /check/:productId` - Check if product is favorited

## Database Schema

The application uses the following tables:

- `users` - User accounts and profiles
- `addresses` - User shipping addresses
- `categories` - Product categories
- `products` - Product catalog
- `cart_items` - Shopping cart items
- `favorites` - User favorite products

All tables have Row Level Security (RLS) enabled for data protection.

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Row Level Security (RLS) on all tables
- Input validation with Zod
- Role-based access control (user/admin)

## Error Handling

The API uses consistent error responses:

```json
{
  "success": false,
  "message": "Error message here"
}
```

## Success Response Format

```json
{
  "success": true,
  "statusCode": 200,
  "data": {},
  "message": "Success message"
}
```

## Development

```bash
npm run dev
```

## Production Build

```bash
npm run build
npm start
```

## License

MIT
