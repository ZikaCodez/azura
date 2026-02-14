# API Documentation

This document describes all backend API routes, request/response structures, data types, and example calls for the E-Commerce Store backend.

---

## Table of Contents
- [Authentication](#authentication)
- [Users](#users)
- [Categories](#categories)
- [Products](#products)
- [Colors](#colors)
- [Orders](#orders)
- [Image Upload](#image-upload)
- [Offers & Discounts](#offers--discounts)
- [Shipping](#shipping)
- [Data Types](#data-types)

---

## Authentication

### Google OAuth
- **GET** `/api/auth/google` — Initiate Google OAuth login
- **GET** `/api/auth/google/callback` — Google OAuth callback

#### Example
```http
GET /api/auth/google
```

---

## Users

- **POST** `/api/users` — Create user
- **GET** `/api/users/:id` — Get user by ID
- **GET** `/api/users` — List users
- **PATCH** `/api/users/:id` — Update user
- **DELETE** `/api/users/:id` — Delete user

### Example: Create User
```http
POST /api/users
Content-Type: application/json

{
  "googleId": "string",
  "email": "user@example.com",
  "name": "John Doe",
  "phone": "0123456789",
  "role": "customer",
  "avatar": "https://...",
  "addresses": [ ... ],
  "wishlist": [1,2],
  "cartItems": [ ... ]
}
```

#### Response
- **201 Created**: Returns the created user object (see [IUser](#iuser)).

---

## Categories

- **POST** `/api/categories` — Create category
- **GET** `/api/categories/:id` — Get category by ID
- **GET** `/api/categories` — List categories
- **PATCH** `/api/categories/:id` — Update category
- **DELETE** `/api/categories/:id` — Delete category

### Example: List Categories
```http
GET /api/categories
```

#### Response
- **200 OK**: Array of [ICategory](#icategory) objects

---

## Products

- **POST** `/api/products` — Create product
- **GET** `/api/products/:id` — Get product by ID
- **GET** `/api/products` — List products
- **PATCH** `/api/products/:id` — Update product
- **DELETE** `/api/products/:id` — Delete product

### Example: Get Product
```http
GET /api/products/123
```

#### Response
- **200 OK**: [IProduct](#iproduct) object

---

## Colors

- **POST** `/api/colors` — Create color (admin)
- **GET** `/api/colors/:id` — Get color by ID
- **GET** `/api/colors` — List colors
- **PATCH** `/api/colors/:id` — Update color (admin)

### Example: List Colors
```http
GET /api/colors
```

#### Response
- **200 OK**: Array of [IColor](#icolor) objects

---

## Orders

- **POST** `/api/orders` — Create order (auth required)
- **GET** `/api/orders/:id` — Get order by ID
- **GET** `/api/orders` — List orders
- **PATCH** `/api/orders/:id/customer` — Customer updates their order
- **PATCH** `/api/orders/:id` — Admin updates order
- **DELETE** `/api/orders/:id` — Delete order

### Example: Create Order
```http
POST /api/orders
Content-Type: application/json
Authorization: Bearer <token>

{
  "userId": 123456,
  "items": [ ... ],
  "shippingAddress": { ... },
  "paymentMethod": "COD",
  ...
}
```

#### Response
- **201 Created**: [IOrder](#iorder) object

---

## Image Upload

- **POST** `/api/image` — Upload image (multipart/form-data, field: `image`)

### Example
```http
POST /api/image
Content-Type: multipart/form-data

image: <file>
```

#### Response
- **200 OK**: `{ "url": "https://..." }`

---

## Offers & Discounts

- **GET** `/api/promos` — List promo codes (admin/editor)
- **POST** `/api/promos` — Create promo code (admin/editor)
- **DELETE** `/api/promos/:id` — Delete promo code (admin/editor)
- **GET** `/api/promos/validate/:code` — Validate promo code
- **POST** `/api/discounts` — Apply discount (admin/editor)
- **GET** `/api/discounts` — List all discounts (admin/editor)

### Example: Validate Promo
```http
GET /api/promos/validate/SUMMER2024
```

#### Response
- **200 OK**: [IPromoCode](#ipromocode) object or 404 if invalid

---

## Shipping

- **GET** `/api/shipping` — List shipping entries
- **GET** `/api/shipping/:id` — Get shipping by governorate id
- **POST** `/api/shipping` — Create shipping entry (admin/editor)
- **PATCH** `/api/shipping/:id` — Update shipping entry (admin/editor)

### Example: List Shipping
```http
GET /api/shipping
```

#### Response
- **200 OK**: [ShippingListResult](#shippinglistresult) object

---

## Data Types

### IUser
```ts
interface IUser {
  _id: number;
  googleId: string;
  email: string;
  name: string;
  phone?: string;
  role: "customer" | "admin" | "editor";
  avatar?: string;
  addresses: IAddress[];
  wishlist: number[];
  cartItems: ICartItem[];
  createdAt: Date;
  lastLogin?: Date;
}
```

### IOrder
```ts
interface IOrder {
  _id?: number;
  userId: number;
  items: IOrderItem[];
  shippingAddress: IAddress;
  paymentMethod: "COD" | "InstaPay";
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: "processing" | "confirmed" | "shipped" | "delivered" | "cancelled" | "return-request" | "returned";
  subtotal: number;
  shippingFee: number;
  discountTotal?: number;
  promoCode?: string;
  total: number;
  trackingNumber?: string;
  placedAt: Date;
  updatedAt?: Date;
}
```

### IProduct
```ts
interface IProduct {
  _id?: number;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  category: number;
  tags: string[];
  variants: IVariant[];
  isFeatured: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  discount?: IDiscount;
}
```

### ICategory
```ts
interface ICategory {
  _id?: number;
  name: string;
  slug: string;
  parentCategory?: string;
  image?: string;
  sizeChart?: string;
  description?: string;
}
```

### IColor
```ts
interface IColor {
  _id: string;
  hex: string;
}
```

### ShippingEntry
```ts
interface ShippingEntry {
  _id: string;
  label?: string;
  price: number;
  currency?: string;
  updatedAt?: Date;
}
```

### ShippingListResult
```ts
interface ShippingListResult {
  items: ShippingEntry[];
  total: number;
}
```

### IPromoCode
```ts
interface IPromoCode {
  _id?: number;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  isActive: boolean;
  minOrderAmount?: number;
  usageLimit?: number;
  usageCount: number;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt?: Date;
}
```

---

## Notes
- All endpoints return JSON.
- Some endpoints require authentication (see above).
- For full request/response examples, see the respective sections above.
- For more details on each type, see the `/backend/types/` directory.
