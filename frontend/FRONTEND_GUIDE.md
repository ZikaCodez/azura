
Frontend Project Guide: E-Commerce Template
1. Project Vision
This frontend is a reusable e-commerce template designed for rapid development and easy customization.

Brand-specific content (name, logo) is managed via src/brand-config.json and public/logo.png. Theme and style customization can be handled using shadcn CLI or similar tools.

To set up a new project:
- Update src/brand-config.json with your brand name and logo path.
- Place your logo file in the public directory (e.g., public/logo.png).
- Set VITE_API_URL in .env to point to your backend API.

All other content is generic and ready for customization.

2. Technical Architecture
Framework: React (Vite)

Styling: Tailwind CSS

UI Library: Shadcn UI.

Icons: Lucide React.

Routing: React Router DOM (v6+).

State Management: React Context (for Auth/Cart) or Zustand.

Notifications: Sonner (Toaster).

Folder Structure
Plaintext
/src
  /assets        # Images, logos, fonts
  /components
    /ui          # Shadcn primitives (Button, Input, Sheet, etc.)
    /layout      # Layout.tsx, Navbar.tsx, Footer.tsx
    /product     # ProductCard.tsx, ProductGrid.tsx, ProductFilters.tsx
    /cart        # CartDrawer.tsx, CartItem.tsx
    /checkout    # CheckoutForm.tsx, OrderSummary.tsx
  /hooks         # Custom hooks (useCart, useProducts)
  /lib           # Utils, API configuration (axios setup)
  /pages         # One folder per route (Home, Shop, Product, Cart, etc.)
  /providers     # Context Providers (AuthProvider, CartProvider, ThemeProvider)
  /types         # TypeScript interfaces
  routes.tsx     # Centralized Route Definitions
  main.tsx       # Entry point with Provider wrappers

  7. API Client (Required)

  All frontend network requests must use the centralized API client at `src/lib/api.ts`.

  - Base URL: reads `VITE_API_URL` and falls back to `/api`, ensuring dev requests are proxied via Vite and production can point to a backend origin.
  - Axios instance: `api` with `withCredentials` enabled and a 30s timeout.
  - Interceptors: unified error handling (Sonner toasts) and helpful dev logs.

  Usage examples:

  ```ts
  import api from "@/lib/api";

  // List products (sorted by newest)
  const sort = JSON.stringify({ createdAt: -1 });
  const { data } = await api.get("/products", { params: { limit: 8, sort } });

  // Get one product by slug
  const { data: product } = await api.get(`/products`, { params: { filter: JSON.stringify({ slug }) } });
  ```

  Environment & Vite proxy:
  - Configure `VITE_API_URL` in your `.env` when pointing to a remote backend.
  - The dev server proxy in `vite.config.ts` forwards `/auth` and `/api` to `VITE_API_URL` (defaults to `http://localhost:3000`). Keep both in sync.
3. The Layout Pattern (Mandatory)
Rule: Every page in the application must be wrapped in a unified Layout.tsx component.

Implementation: The Layout component should NOT be manually imported in every page file. Instead, it should be applied as a wrapper inside routes.tsx.

Behavior: Sticky Navbar with backdrop blur, responsive mobile drawer, and consistent Footer.

Auth Awareness: The Navbar must change state based on useAuth (Show "Login" vs. "User Menu").

Toaster: The <Toaster /> component must be placed here or in the root provider.

4. Routing Strategy (New)
File: src/routes.tsx We utilize a centralized routing configuration to manage layouts, authentication guards, and page rendering.

Rules for routes.tsx:

Central Source of Truth: All application paths are defined here.

Layout Wrapping: Route elements should be wrapped in <Layout> (or a specific Layout wrapper component) within this file to ensure consistency.

Protected Routes: Use a ProtectedRoute wrapper for authenticated pages (e.g., /profile, /checkout).

Reference Implementation (routes.tsx):

TypeScript
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute"; // You will create this
import { Home, Shop, ProductDetails, Cart, Checkout, Profile, Success, NotFound } from "@/pages";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes wrapped in Layout */}
      <Route element={<Layout><Home /></Layout>} path="/" />
      <Route element={<Layout><Shop /></Layout>} path="/shop" />
      <Route element={<Layout><ProductDetails /></Layout>} path="/product/:slug" />
      <Route element={<Layout><Cart /></Layout>} path="/cart" />
      
      {/* Protected Routes */}
      <Route 
        path="/checkout" 
        element={
          <ProtectedRoute>
             {/* Checkout might have a different minimal layout */}
             <Checkout /> 
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        } 
      />

      {/* Success & 404 */}
      <Route element={<Layout><Success /></Layout>} path="/success" />
      <Route element={<Layout><NotFound /></Layout>} path="*" />
    </Routes>
  );
}
Reference Implementation (main.tsx):

TypeScript
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import { AuthProvider } from "./providers/AuthProvider";
import { CartProvider } from "./providers/CartProvider";
import "./index.css"; 

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

5. Detailed Page and Component Specifications

## Pages (src/pages)

- **Home**: Main landing page, features hero, featured products, and category highlights.
- **Shop**: Product listing with filters (category, color, size, price, etc.), pagination, and sorting.
- **Product**: Product details by slug, with images, description, price, variants (color/size), add to cart, and size chart.
- **Cart**: Cart summary, editable items, quantity, variant selection, and proceed to checkout.
- **Checkout**: Protected page for order placement, address entry (with Egypt governorate/area combobox), order summary, and payment initiation.
- **Account**: Protected user settings page for managing profile, addresses, and preferences.
- **Orders**: Protected user order history and order details.
- **CompleteRegister**: Finalizes registration for users who signed up via OAuth but need to complete profile.
- **Admin/Dashboard**: Overview of sales, stats, and top products (admin/editor only).
- **Admin/ProductsPage**: Admin product management (CRUD), including dialogs for creating/editing products, categories, colors, discounts, promos, and toggling featured/status.
- **Admin/OrdersPage**: Admin order management, status/payment updates, and order details.
- **Admin/UsersPage**: Admin user management, including role changes, viewing addresses, carts, and orders.
- **Footer/FAQ, TermsOfService, ReturnsPolicy, PrivacyPolicy**: Informational static pages linked from the footer.
- **NotFound**: 404 page for unmatched routes.

## Components (src/components)

### layout/
- **Layout.tsx**: Universal wrapper for all pages, enforces sticky Navbar, Footer, and Toaster. Handles session expiration.
- **Navbar.tsx**: Responsive navigation bar with brand logo, theme switcher, login/user menu, and cart dialog. Mobile menu fetches categories dynamically.
- **Footer.tsx**: Brand info, quick links (FAQ, policies), and social/contact buttons.

### auth/
- **LoginButton.tsx**: Triggers Google OAuth login, preserves current path for redirect.
- **ProtectedRoute.tsx**: Guards routes by authentication and (optionally) role (editor/admin). Redirects unauthenticated users to login.
- **UserMenu.tsx**: Dropdown for logged-in users: links to orders, account, dashboard (if admin/editor), and logout.

### cart/
- **CartDialog.tsx**: Modal dialog showing cart contents, subtotal, clear cart, and checkout. Syncs with backend for product/variant/discount updates.
- **CartItem.tsx**: Cart item row with image, title, variant selectors (color/size), quantity, price, discount badge, and remove button. Handles variant changes and merges.

### category/
- **CategoryCard.tsx**: Card for displaying a product category with image, name, description, and click-to-filter.
- **SizeChart.tsx**: Button/dialog to display a category-specific size chart image, fetched from backend.

### common/
- **QuantitySelector.tsx**: Plus/minus button group for selecting item quantity, with min/max bounds.
- **SectionHeader.tsx**: Section title and description, with configurable alignment.
- **UserAddress.tsx**: Address form with Egypt governorate/area comboboxes, street/building/apartment/notes fields, and make default/remove actions.

### discount/
- **DiscountCard.tsx**: Displays a discount or promo offer.
- **DiscountsContainer.tsx**: Container for listing multiple discounts.

### orders/
- **UserOrder.tsx**: Displays a user's order details.

### product/
- **ProductCard.tsx**: Card for a product with image, name, price, discount, and add-to-cart button.
- **ProductFilters.tsx**: Filter controls for shop/product lists (category, color, size, price, etc.).
- **SizeSelector.tsx**: Selector for choosing product size (used in product details/cart).

### admin/
- **Orders/**: Admin order management components (ActionButtons, OrderCard, OrderStatus, PaymentStatus).
- **Overview/**: Admin dashboard widgets (DatePickerWithRange, SalesChart, StatsCard, TopProductCard).
- **Products/**: Admin product management (Create dialogs, ProductForm, ProductImages, ProductsTable, ProductStatusToggle, VariantsEditor, etc.).
- **Shipping/**: Admin shipping management (ShippingFees, ShippingManagerDialog).
- **Users/**: Admin user management (ChangeRole, DeleteUserButton, EditUserButton, UserCard, ViewAddressesButton, ViewCartButton, ViewOrdersButton).

## Excluded: components/ui
All files in `components/ui` are shadcn/ui primitives and should be referenced via shadcn documentation. Do not describe or modify these directly.

## Context Providers (src/providers)
- **AuthProvider.tsx**: Provides authentication state and user info.
- **CartProvider.tsx**: Provides cart state and actions.
- **ThemeProvider.tsx**: Provides theme (light/dark) and toggler.

## Utilities (src/lib)
- **api.ts**: Centralized Axios API client with interceptors, error handling, and VITE_API_URL support.
- **discounts.ts**: Discount calculation and helpers.
- **egyptLocations.ts**: Egypt governorate/area data and helpers for address forms.
- **utils.ts**: General utility functions.

## Types (src/types)
TypeScript interfaces for all major entities: product, category, color, order, promo, user, cart, offer, auth, etc.

## Routing (src/routes.tsx)
All routes are defined centrally. Layout and authentication are enforced here. See code for details.

## Entry (src/main.tsx)
App entry point, wraps with BrowserRouter, AuthProvider, CartProvider, and renders AppRoutes.

6. Consistency Guidelines
Navigation: routes.tsx is the map. Layout.tsx is the frame.

Buttons: Use Shadcn Button component.

Typography: Unified font family (Inter or similar). Headings Bold/Semibold.