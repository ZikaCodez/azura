
1. Project Overview
Azura is a modern, scalable e-commerce backend designed for rapid development, customization, and real-world business needs. The project evolves around modularity, strict typing, and practical business logic, supporting features like bundles with expiry dates, made-to-order products, and Google OAuth authentication.

Core Philosophy: Simplicity, Speed, and Real-World Flexibility. Uses native MongoDB drivers, avoids unnecessary abstractions, and adapts to evolving business requirements.

Key Constraints: No ORMs, strict typing via TypeScript interfaces, Google OAuth authentication, and business-driven data models (e.g., bundles with expiry).


2. Technical Stack
- Node.js (v18+)
- Express.js
- MongoDB (Native Driver)
- Passport.js (Google OAuth 2.0)
- express-session + connect-mongo
- JavaScript (Runtime) with TypeScript Interfaces


3. Architecture & Folder Structure
Azura follows a modular "Controller-Service" pattern, focusing on business logic in controllers and strict data typing in /types. No service layer bloat—controllers directly handle business rules and database operations.

Folder Structure:
/backend
  /config           # Configuration files
  /controllers      # Business logic
  /core             # Database connection & shared utilities
  /middleware       # Route protection & validation
  /routes           # API endpoint definitions
  /types            # TypeScript interfaces
  /utils            # Utility functions
  app.js            # App entry point
  server.js         # Server listener
  .env              # Secrets and environment variables


1. Database Strategy
- Database name and URI are configured via process.env.MONGODB_URI.
- Connection is established once in core/db.js and reused throughout the app.
- No ORMs: Use native MongoDB driver (db.collection('products').find(...)).
- ID Schema: All _id fields are 6-digit integers (e.g., 104928). Check for collisions before insertion.
- Bundles and other business entities are stored with evolving fields (e.g., expire for bundles).


5. Data Models
Refer to /types for the exact shape. Data models evolve to match business needs:

Example Bundle Interface (types/bundle.ts):
export interface Bundle {
  id: string;
  name: string;
  slug: string;
  description?: string;
  productIds: string[];
  price: number;
  image: string;
  expire?: Date; // Optional expiry date for bundle validity
}

Example User Interface (types/user.ts):
export interface IUser {
  _id: number;         // 6-digit integer
  googleId: string;    // From Google Profile
  email: string;
  name: string;
  phone?: string;
  role: "customer" | "admin" | "editor";
  addresses: IAddress[];
  createdAt: Date;
}


1. Authentication Strategy
Passwordless flow using Google OAuth.

Smart Redirect Flow:
- Frontend sends user to /auth/google?redirect=/cart.
- Backend captures req.query.redirect, encodes it, and passes it to Google via the state parameter.
- Backend callback decodes state and redirects user to ${CLIENT_URL}${decodedPath}.

User Creation Logic:
- Search for user by googleId.
- If found, update lastLogin and return user.
- If new, generate 6-digit _id, create user object, and insert into database.


7. Business Logic
A. Inventory Management
- Products are made-to-order; variants do not track stock.
B. Bundles
- Bundles can have an optional expire field, allowing time-limited offers and business-driven promotions.
- Bundle controller logic supports expire for creation, update, and response.
C. Soft Deletes
- Never use deleteOne on Products or Users. Set isActive: false instead.
- All find queries should include { isActive: true } unless for admin views.
D. Phone Validation
- Middleware requirePhone enforces phone requirement for checkout.
- If user lacks phone, return 403 with code MISSING_PHONE.


8. Development Notes
- All environment-specific values are set via .env file.
- Data models and controllers are designed to evolve as business needs change (e.g., adding expire to bundles).
- No brand or identity-specific logic is included; this template is fully generic and ready for customization.