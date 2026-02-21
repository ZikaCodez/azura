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
- [Bundles](#bundles)
- [Collections](#collections)
- [Components](#components)
- [Custom Accessories](#custom-accessories)
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
  "addresses": [],
  "wishlist": [],
  "cartItems": [],
  "customAccessories": []
}
```
#### Response
**201 Created**
```json
{
  "_id": 1,
  "googleId": "string",
  "email": "user@example.com",
  "name": "John Doe",
  "phone": "0123456789",
  "role": "customer",
  "avatar": "https://...",
  "addresses": [],
  "wishlist": [],
  "cartItems": [],
  "customAccessories": [],
  "createdAt": "2026-02-21T12:00:00.000Z"
}
```

### Example: Get User by ID
```http
GET /api/users/1
```
#### Response
**200 OK**
```json
{
  "_id": 1,
  "googleId": "string",
  "email": "user@example.com",
  "name": "John Doe",
  "phone": "0123456789",
  "role": "customer",
  "avatar": "https://...",
  "addresses": [],
  "wishlist": [],
  "cartItems": [],
  "customAccessories": [],
  "createdAt": "2026-02-21T12:00:00.000Z"
}
```

### Example: List Users
```http
GET /api/users
```
#### Response
**200 OK**
```json
[
  {
    "_id": 1,
    "googleId": "string",
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "0123456789",
    "role": "customer",
    "avatar": "https://...",
    "addresses": [],
    "wishlist": [],
    "cartItems": [],
    "customAccessories": [],
    "createdAt": "2026-02-21T12:00:00.000Z"
  }
]
```

### Example: Update User
```http
PATCH /api/users/1
Content-Type: application/json

{
  "name": "Jane Doe",
  "phone": "0111111111"
}
```
#### Response
**200 OK**
```json
{
  "_id": 1,
  "googleId": "string",
  "email": "user@example.com",
  "name": "Jane Doe",
  "phone": "0111111111",
  "role": "customer",
  "avatar": "https://...",
  "addresses": [],
  "wishlist": [],
  "cartItems": [],
  "customAccessories": [],
  "createdAt": "2026-02-21T12:00:00.000Z"
}
```

### Example: Delete User
```http
DELETE /api/users/1
```
#### Response
**204 No Content**


---

## Categories

- **POST** `/api/categories` — Create category
- **GET** `/api/categories/:id` — Get category by ID
- **GET** `/api/categories` — List categories
- **PATCH** `/api/categories/:id` — Update category
- **DELETE** `/api/categories/:id` — Delete category


### Example: Create Category
```http
POST /api/categories
Content-Type: application/json

{
  "name": "Rings",
  "slug": "rings",
  "description": "All ring products"
}
```
#### Response
**201 Created**
```json
{
  "_id": 1,
  "name": "Rings",
  "slug": "rings",
  "description": "All ring products"
}
```

### Example: Get Category by ID
```http
GET /api/categories/1
```
#### Response
**200 OK**
```json
{
  "_id": 1,
  "name": "Rings",
  "slug": "rings",
  "description": "All ring products"
}
```

### Example: List Categories
```http
GET /api/categories
```
#### Response
**200 OK**
```json
[
  {
    "_id": 1,
    "name": "Rings",
    "slug": "rings",
    "description": "All ring products"
  }
]
```

### Example: Update Category
```http
PATCH /api/categories/1
Content-Type: application/json

{
  "name": "Bracelets"
}
```
#### Response
**200 OK**
```json
{
  "_id": 1,
  "name": "Bracelets",
  "slug": "rings",
  "description": "All ring products"
}
```

### Example: Delete Category
```http
DELETE /api/categories/1
```
#### Response
**204 No Content**


---

## Products

- **POST** `/api/products` — Create product
- **GET** `/api/products/:id` — Get product by ID
- **GET** `/api/products` — List products
- **PATCH** `/api/products/:id` — Update product
- **DELETE** `/api/products/:id` — Delete product


### Example: Create Product
```http
POST /api/products
Content-Type: application/json

{
  "name": "Gold Ring",
  "slug": "gold-ring",
  "description": "18k gold ring",
  "basePrice": 1200,
  "category": 1,
  "tags": ["gold", "ring"],
  "color": "#FFD700",
  "image": "https://...",
  "isFeatured": true,
  "isActive": true
}
```
#### Response
**201 Created**
```json
{
  "_id": 1,
  "name": "Gold Ring",
  "slug": "gold-ring",
  "description": "18k gold ring",
  "basePrice": 1200,
  "category": 1,
  "tags": ["gold", "ring"],
  "color": "#FFD700",
  "image": "https://...",
  "isFeatured": true,
  "isActive": true,
  "createdAt": "2026-02-21T12:00:00.000Z",
  "updatedAt": "2026-02-21T12:00:00.000Z"
}
```

### Example: Get Product by ID
```http
GET /api/products/1
```
#### Response
**200 OK**
```json
{
  "_id": 1,
  "name": "Gold Ring",
  "slug": "gold-ring",
  "description": "18k gold ring",
  "basePrice": 1200,
  "category": 1,
  "tags": ["gold", "ring"],
  "color": "#FFD700",
  "image": "https://...",
  "isFeatured": true,
  "isActive": true,
  "createdAt": "2026-02-21T12:00:00.000Z",
  "updatedAt": "2026-02-21T12:00:00.000Z"
}
```

### Example: List Products
```http
GET /api/products
```
#### Response
**200 OK**
```json
[
  {
    "_id": 1,
    "name": "Gold Ring",
    "slug": "gold-ring",
    "description": "18k gold ring",
    "basePrice": 1200,
    "category": 1,
    "tags": ["gold", "ring"],
    "color": "#FFD700",
    "image": "https://...",
    "isFeatured": true,
    "isActive": true,
    "createdAt": "2026-02-21T12:00:00.000Z",
    "updatedAt": "2026-02-21T12:00:00.000Z"
  }
]
```

### Example: Update Product
```http
PATCH /api/products/1
Content-Type: application/json

{
  "name": "Silver Ring"
}
```
#### Response
**200 OK**
```json
{
  "_id": 1,
  "name": "Silver Ring",
  "slug": "gold-ring",
  "description": "18k gold ring",
  "basePrice": 1200,
  "category": 1,
  "tags": ["gold", "ring"],
  "color": "#FFD700",
  "image": "https://...",
  "isFeatured": true,
  "isActive": true,
  "createdAt": "2026-02-21T12:00:00.000Z",
  "updatedAt": "2026-02-21T12:00:00.000Z"
}
```

### Example: Delete Product
```http
DELETE /api/products/1
```
#### Response
**204 No Content**


---

## Colors

- **POST** `/api/colors` — Create color (admin)
- **GET** `/api/colors/:id` — Get color by ID
- **GET** `/api/colors` — List colors
- **PATCH** `/api/colors/:id` — Update color (admin)


### Example: Create Color
```http
POST /api/colors
Content-Type: application/json

{
  "hex": "#FFD700"
}
```
#### Response
**201 Created**
```json
{
  "_id": "1",
  "hex": "#FFD700"
}
```

### Example: Get Color by ID
```http
GET /api/colors/1
```
#### Response
**200 OK**
```json
{
  "_id": "1",
  "hex": "#FFD700"
}
```

### Example: List Colors
```http
GET /api/colors
```
#### Response
**200 OK**
```json
[
  {
    "_id": "1",
    "hex": "#FFD700"
  }
]
```

### Example: Update Color
```http
PATCH /api/colors/1
Content-Type: application/json

{
  "hex": "#C0C0C0"
}
```
#### Response
**200 OK**
```json
{
  "_id": "1",
  "hex": "#C0C0C0"
}
```


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
  "userId": 1,
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "price": 1200
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Cairo",
    "governorate": "Cairo",
    "postalCode": "12345"
  },
  "paymentMethod": "COD"
}
```
#### Response
**201 Created**
```json
{
  "_id": 1,
  "userId": 1,
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "price": 1200
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Cairo",
    "governorate": "Cairo",
    "postalCode": "12345"
  },
  "paymentMethod": "COD",
  "paymentStatus": "pending",
  "orderStatus": "processing",
  "subtotal": 2400,
  "shippingFee": 50,
  "originalTotal": 2450,
  "total": 2450,
  "placedAt": "2026-02-21T12:00:00.000Z"
}
```

### Example: Get Order by ID
```http
GET /api/orders/1
```
#### Response
**200 OK**
```json
{
  "_id": 1,
  "userId": 1,
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "price": 1200
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Cairo",
    "governorate": "Cairo",
    "postalCode": "12345"
  },
  "paymentMethod": "COD",
  "paymentStatus": "pending",
  "orderStatus": "processing",
  "subtotal": 2400,
  "shippingFee": 50,
  "originalTotal": 2450,
  "total": 2450,
  "placedAt": "2026-02-21T12:00:00.000Z"
}
```

### Example: List Orders
```http
GET /api/orders
```
#### Response
**200 OK**
```json
[
  {
    "_id": 1,
    "userId": 1,
    "items": [
      {
        "productId": 1,
        "quantity": 2,
        "price": 1200
      }
    ],
    "shippingAddress": {
      "street": "123 Main St",
      "city": "Cairo",
      "governorate": "Cairo",
      "postalCode": "12345"
    },
    "paymentMethod": "COD",
    "paymentStatus": "pending",
    "orderStatus": "processing",
    "subtotal": 2400,
    "shippingFee": 50,
    "originalTotal": 2450,
    "total": 2450,
    "placedAt": "2026-02-21T12:00:00.000Z"
  }
]
```

### Example: Update Order (Customer)
```http
PATCH /api/orders/1/customer
Content-Type: application/json
Authorization: Bearer <token>

{
  "shippingAddress": {
    "street": "456 New St",
    "city": "Giza",
    "governorate": "Giza",
    "postalCode": "54321"
  }
}
```
#### Response
**200 OK**
```json
{
  "_id": 1,
  "userId": 1,
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "price": 1200
    }
  ],
  "shippingAddress": {
    "street": "456 New St",
    "city": "Giza",
    "governorate": "Giza",
    "postalCode": "54321"
  },
  "paymentMethod": "COD",
  "paymentStatus": "pending",
  "orderStatus": "processing",
  "subtotal": 2400,
  "shippingFee": 50,
  "originalTotal": 2450,
  "total": 2450,
  "placedAt": "2026-02-21T12:00:00.000Z"
}
```

### Example: Update Order (Admin)
```http
PATCH /api/orders/1
Content-Type: application/json
Authorization: Bearer <admin-token>

{
  "orderStatus": "shipped"
}
```
#### Response
**200 OK**
```json
{
  "_id": 1,
  "userId": 1,
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "price": 1200
    }
  ],
  "shippingAddress": {
    "street": "456 New St",
    "city": "Giza",
    "governorate": "Giza",
    "postalCode": "54321"
  },
  "paymentMethod": "COD",
  "paymentStatus": "pending",
  "orderStatus": "shipped",
  "subtotal": 2400,
  "shippingFee": 50,
  "originalTotal": 2450,
  "total": 2450,
  "placedAt": "2026-02-21T12:00:00.000Z"
}
```

### Example: Delete Order
```http
DELETE /api/orders/1
Authorization: Bearer <admin-token>
```
#### Response
**204 No Content**


---

## Bundles

- **POST** `/api/bundles` — Create bundle (admin/editor)
- **GET** `/api/bundles/:id` — Get bundle by ID
- **GET** `/api/bundles` — List bundles
- **PATCH** `/api/bundles/:id` — Update bundle (admin/editor)
- **DELETE** `/api/bundles/:id` — Delete bundle (admin/editor)


### Example: Create Bundle
```http
POST /api/bundles
Content-Type: application/json
Authorization: Bearer <admin-token>

{
  "name": "Summer Set",
  "slug": "summer-set",
  "description": "Bundle for summer",
  "productIds": ["1", "2"],
  "price": 2000,
  "image": "https://...",
  "expire": "2026-03-01T00:00:00.000Z" // optional
}
```
#### Response
**201 Created**
```json
{
  "id": "abc123",
  "name": "Summer Set",
  "slug": "summer-set",
  "description": "Bundle for summer",
  "productIds": ["1", "2"],
  "price": 2000,
  "image": "https://...",
  "expire": "2026-03-01T00:00:00.000Z" // optional
}
```

### Example: Get Bundle by ID
```http
GET /api/bundles/abc123
```
#### Response
**200 OK**
```json
{
  "id": "abc123",
  "name": "Summer Set",
  "slug": "summer-set",
  "description": "Bundle for summer",
  "productIds": ["1", "2"],
  "price": 2000,
  "image": "https://...",
  "expire": "2026-03-01T00:00:00.000Z" // optional
}
```

### Example: List Bundles
```http
GET /api/bundles
```
#### Response
**200 OK**
```json
[
  {
    "id": "abc123",
    "name": "Summer Set",
    "slug": "summer-set",
    "description": "Bundle for summer",
    "productIds": ["1", "2"],
    "price": 2000,
    "image": "https://...",
    "expire": "2026-03-01T00:00:00.000Z" // optional
  }
]
```

### Example: Update Bundle
```http
PATCH /api/bundles/abc123
Content-Type: application/json
Authorization: Bearer <admin-token>

{
  "price": 1800,
  "expire": "2026-03-01T00:00:00.000Z" // optional
}
```
#### Response
**200 OK**
```json
{
  "id": "abc123",
  "name": "Summer Set",
  "slug": "summer-set",
  "description": "Bundle for summer",
  "productIds": ["1", "2"],
  "price": 1800,
  "image": "https://...",
  "expire": "2026-03-01T00:00:00.000Z" // optional
}
```

### Example: Delete Bundle
```http
DELETE /api/bundles/abc123
Authorization: Bearer <admin-token>
```
#### Response
**204 No Content**


---

## Collections

- **POST** `/api/collections` — Create collection (admin/editor)
- **GET** `/api/collections/:id` — Get collection by ID
- **GET** `/api/collections` — List collections
- **PATCH** `/api/collections/:id` — Update collection (admin/editor)
- **DELETE** `/api/collections/:id` — Delete collection (admin/editor)


### Example: Create Collection
```http
POST /api/collections
Content-Type: application/json
Authorization: Bearer <admin-token>

{
  "name": "Summer 2026",
  "slug": "summer2026",
  "description": "Summer collection",
  "productIds": ["1", "2"]
}
```
#### Response
**201 Created**
```json
{
  "id": "summer2026",
  "name": "Summer 2026",
  "slug": "summer2026",
  "description": "Summer collection",
  "productIds": ["1", "2"]
}
```

### Example: Get Collection by ID
```http
GET /api/collections/summer2026
```
#### Response
**200 OK**
```json
{
  "id": "summer2026",
  "name": "Summer 2026",
  "slug": "summer2026",
  "description": "Summer collection",
  "productIds": ["1", "2"]
}
```

### Example: List Collections
```http
GET /api/collections
```
#### Response
**200 OK**
```json
[
  {
    "id": "summer2026",
    "name": "Summer 2026",
    "slug": "summer2026",
    "description": "Summer collection",
    "productIds": ["1", "2"]
  }
]
```

### Example: Update Collection
```http
PATCH /api/collections/summer2026
Content-Type: application/json
Authorization: Bearer <admin-token>

{
  "description": "Updated summer collection"
}
```
#### Response
**200 OK**
```json
{
  "id": "summer2026",
  "name": "Summer 2026",
  "slug": "summer2026",
  "description": "Updated summer collection",
  "productIds": ["1", "2"]
}
```

### Example: Delete Collection
```http
DELETE /api/collections/summer2026
Authorization: Bearer <admin-token>
```
#### Response
**204 No Content**


---

## Components

- **POST** `/api/components` — Create component (admin/editor)
- **GET** `/api/components/:id` — Get component by ID
- **GET** `/api/components` — List components
- **PATCH** `/api/components/:id` — Update component (admin/editor)
- **DELETE** `/api/components/:id` — Delete component (admin/editor)


### Example: Create Component
```http
POST /api/components
Content-Type: application/json
Authorization: Bearer <admin-token>

{
  "name": "Marble Stone",
  "type": "stone",
  "price": 100,
  "image": "https://..."
}
```
#### Response
**201 Created**
```json
{
  "id": "marble01",
  "name": "Marble Stone",
  "type": "stone",
  "price": 100,
  "image": "https://..."
}
```

### Example: Get Component by ID
```http
GET /api/components/marble01
```
#### Response
**200 OK**
```json
{
  "id": "marble01",
  "name": "Marble Stone",
  "type": "stone",
  "price": 100,
  "image": "https://..."
}
```

### Example: List Components
```http
GET /api/components
```
#### Response
**200 OK**
```json
[
  {
    "id": "marble01",
    "name": "Marble Stone",
    "type": "stone",
    "price": 100,
    "image": "https://..."
  }
]
```

### Example: Update Component
```http
PATCH /api/components/marble01
Content-Type: application/json
Authorization: Bearer <admin-token>

{
  "price": 120
}
```
#### Response
**200 OK**
```json
{
  "id": "marble01",
  "name": "Marble Stone",
  "type": "stone",
  "price": 120,
  "image": "https://..."
}
```

### Example: Delete Component
```http
DELETE /api/components/marble01
Authorization: Bearer <admin-token>
```
#### Response
**204 No Content**


---

## Custom Accessories

- **POST** `/api/custom-accessories` — Create custom accessory (user)
- **GET** `/api/custom-accessories/:id` — Get custom accessory by ID
- **GET** `/api/custom-accessories` — List custom accessories
- **PATCH** `/api/custom-accessories/:id` — Update custom accessory (user/admin)
- **DELETE** `/api/custom-accessories/:id` — Delete custom accessory (user/admin)


### Example: Create Custom Accessory
```http
POST /api/custom-accessories
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Custom Bracelet",
  "type": "bracelet",
  "structure": [
    { "id": "marble01", "name": "Marble Stone", "type": "stone", "price": 100, "image": "https://..." }
  ],
  "status": "private",
  "image": "https://..."
}
```
#### Response
**201 Created**
```json
{
  "id": "xyz789",
  "userId": "1",
  "name": "Custom Bracelet",
  "type": "bracelet",
  "structure": [
    { "id": "marble01", "name": "Marble Stone", "type": "stone", "price": 100, "image": "https://..." }
  ],
  "status": "private",
  "image": "https://...",
  "createdAt": "2026-02-21T12:00:00.000Z"
}
```

### Example: Get Custom Accessory by ID
```http
GET /api/custom-accessories/xyz789
```
#### Response
**200 OK**
```json
{
  "id": "xyz789",
  "userId": "1",
  "name": "Custom Bracelet",
  "type": "bracelet",
  "structure": [
    { "id": "marble01", "name": "Marble Stone", "type": "stone", "price": 100, "image": "https://..." }
  ],
  "status": "private",
  "image": "https://...",
  "createdAt": "2026-02-21T12:00:00.000Z"
}
```

### Example: List Custom Accessories
```http
GET /api/custom-accessories
```
#### Response
**200 OK**
```json
[
  {
    "id": "xyz789",
    "userId": "1",
    "name": "Custom Bracelet",
    "type": "bracelet",
    "structure": [
      { "id": "marble01", "name": "Marble Stone", "type": "stone", "price": 100, "image": "https://..." }
    ],
    "status": "private",
    "image": "https://...",
    "createdAt": "2026-02-21T12:00:00.000Z"
  }
]
```

### Example: Update Custom Accessory
```http
PATCH /api/custom-accessories/xyz789
Content-Type: application/json
Authorization: Bearer <token>

{
  "status": "public"
}
```
#### Response
**200 OK**
```json
{
  "id": "xyz789",
  "userId": "1",
  "name": "Custom Bracelet",
  "type": "bracelet",
  "structure": [
    { "id": "marble01", "name": "Marble Stone", "type": "stone", "price": 100, "image": "https://..." }
  ],
  "status": "public",
  "image": "https://...",
  "createdAt": "2026-02-21T12:00:00.000Z"
}
```

### Example: Delete Custom Accessory
```http
DELETE /api/custom-accessories/xyz789
Authorization: Bearer <token>
```
#### Response
**204 No Content**


---

## Image Upload

- **POST** `/api/image` — Upload image (multipart/form-data, field: `image`)


### Example: Upload Image
```http
POST /api/image
Content-Type: multipart/form-data

image: <file>
```
#### Response
**200 OK**
```json
{
  "url": "https://..."
}
```


---

## Offers & Discounts

- **GET** `/api/promos` — List promo codes (admin/editor)
- **POST** `/api/promos` — Create promo code (admin/editor)
- **DELETE** `/api/promos/:id` — Delete promo code (admin/editor)
- **GET** `/api/promos/validate/:code` — Validate promo code
- **POST** `/api/discounts` — Apply discount (admin/editor)
- **GET** `/api/discounts` — List all discounts (admin/editor)


### Example: List Promo Codes
```http
GET /api/promos
Authorization: Bearer <admin-token>
```
#### Response
**200 OK**
```json
[
  {
    "_id": 1,
    "code": "SUMMER2024",
    "type": "percentage",
    "value": 10,
    "isActive": true,
    "usageCount": 0,
    "createdAt": "2026-02-21T12:00:00.000Z"
  }
]
```

### Example: Create Promo Code
```http
POST /api/promos
Content-Type: application/json
Authorization: Bearer <admin-token>

{
  "code": "SUMMER2024",
  "type": "percentage",
  "value": 10
}
```
#### Response
**201 Created**
```json
{
  "_id": 1,
  "code": "SUMMER2024",
  "type": "percentage",
  "value": 10,
  "isActive": true,
  "usageCount": 0,
  "createdAt": "2026-02-21T12:00:00.000Z"
}
```

### Example: Delete Promo Code
```http
DELETE /api/promos/1
Authorization: Bearer <admin-token>
```
#### Response
**204 No Content**

### Example: Validate Promo
```http
GET /api/promos/validate/SUMMER2024
```
#### Response
**200 OK**
```json
{
  "_id": 1,
  "code": "SUMMER2024",
  "type": "percentage",
  "value": 10,
  "isActive": true,
  "usageCount": 0,
  "createdAt": "2026-02-21T12:00:00.000Z"
}
```

### Example: Apply Discount
```http
POST /api/discounts
Content-Type: application/json
Authorization: Bearer <admin-token>

{
  "productId": 1,
  "discount": {
    "type": "percentage",
    "value": 10
  }
}
```
#### Response
**200 OK**
```json
{
  "productId": 1,
  "discount": {
    "type": "percentage",
    "value": 10
  }
}
```

### Example: List Discounts
```http
GET /api/discounts
Authorization: Bearer <admin-token>
```
#### Response
**200 OK**
```json
[
  {
    "productId": 1,
    "discount": {
      "type": "percentage",
      "value": 10
    }
  }
]
```


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
**200 OK**
```json
{
  "items": [
    {
      "_id": "1",
      "label": "Cairo",
      "price": 50,
      "currency": "EGP"
    }
  ],
  "total": 1
}
```

### Example: Get Shipping by Governorate ID
```http
GET /api/shipping/1
```
#### Response
**200 OK**
```json
{
  "_id": "1",
  "label": "Cairo",
  "price": 50,
  "currency": "EGP"
}
```

### Example: Create Shipping Entry
```http
POST /api/shipping
Content-Type: application/json
Authorization: Bearer <admin-token>

{
  "label": "Giza",
  "price": 60,
  "currency": "EGP"
}
```
#### Response
**201 Created**
```json
{
  "_id": "2",
  "label": "Giza",
  "price": 60,
  "currency": "EGP"
}
```

### Example: Update Shipping Entry
```http
PATCH /api/shipping/2
Content-Type: application/json
Authorization: Bearer <admin-token>

{
  "price": 65
}
```
#### Response
**200 OK**
```json
{
  "_id": "2",
  "label": "Giza",
  "price": 65,
  "currency": "EGP"
}
```


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
  customAccessories?: CustomAccessory[];
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
  originalTotal: number;
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
  color: string;
  image: string;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  discount?: IDiscount;
}
```

### Bundle
```ts
interface Bundle {
  id: string;
  name: string;
  slug: string;
  description?: string;
  productIds: string[];
  price: number;
  image: string;
  expire?: Date;
}
```

### Collection
```ts
interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  productIds: string[];
}
```

### Component
```ts
interface Component {
  id: string;
  name: string;
  type: string;
  price: number;
  image: string;
}
```

### CustomAccessory
```ts
interface CustomAccessory {
  id: string;
  userId: string;
  name: string;
  type: string;
  structure: Component[];
  status: "private" | "public" | "reviewing";
  image: string;
  createdAt: Date;
  updatedAt?: Date;
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
