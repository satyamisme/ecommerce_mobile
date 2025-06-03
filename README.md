# Mobile E-commerce Platform

This project is a feature-rich mock e-commerce platform specializing in mobile phones, built with React, Vite, TypeScript, and Tailwind CSS. It showcases a range of functionalities including product browsing, filtering, a shopping cart, a checkout process, and an admin section for managing products, orders, and users. The application uses a mock API service to simulate backend interactions.

## Features Implemented

*   **Product Listing & Filtering:**
    *   View a catalog of mobile phones.
    *   Filter products by brand and price range.
    *   Sort products by price, newness, or featured status.
    *   Search functionality for products.
*   **Product Details:**
    *   View detailed information for each product, including specs, images, and stock levels.
    *   "Out of Stock" indicators and disabled "Add to Cart" buttons for unavailable products.
    *   Low stock warnings ("Only X left!").
*   **Shopping Cart:**
    *   Add/remove products to/from the cart.
    *   Update item quantities in the cart.
    *   View cart summary with subtotal, tax, and total.
    *   Clear and consistent empty cart messages.
*   **User Authentication (Mock):**
    *   User login and registration.
    *   Distinction between regular users and admin users.
    *   Admin access grants entry to the admin dashboard.
    *   User data (including a mock admin) is managed by the mock API service.
*   **Checkout Process:**
    *   Collect basic shipping information.
    *   Place mock orders, which are then added to an order list.
    *   Stock levels are updated (reduced) upon successful order placement.
    *   Cart is cleared after a successful order.
*   **Admin Dashboard:**
    *   Centralized navigation for admin functionalities.
    *   **Product Management (CRUD):**
        *   View a list of all products in a table.
        *   Add new products via a form.
        *   Edit existing products using a pre-filled form.
        *   Delete products with a confirmation step.
    *   **Order Management (Read-only):**
        *   View a list of all customer orders with details like Order ID, User ID, total amount, status, and item count.
    *   **User Management (Read-only):**
        *   View a list of all registered users with details like User ID, name, email, and role.
*   **Mock API Service:**
    *   Simulates backend operations using in-memory data (`mockData.ts`).
    *   Includes functions for fetching, adding, updating, and deleting products, users, and orders.
    *   Simulates network delays for a more realistic feel.
*   **UI/UX Enhancements:**
    *   Responsive design with Tailwind CSS.
    *   Loading spinners for data fetching and processing states.
    *   User feedback on actions (e.g., "Added to cart!" notification).
    *   Consistent page titles and clear empty state messages.
    *   Professional look and feel using utility-first CSS and icons.

## Tech Stack

*   **Frontend:** React, Vite, TypeScript
*   **Styling:** Tailwind CSS
*   **Routing:** React Router DOM
*   **State Management:** React Context API (for Auth and Cart)
*   **Icons:** Lucide React
*   **Animations:** Framer Motion (basic page/component transitions)
*   **Linting:** ESLint

## Getting Started

### Prerequisites

*   Node.js (Latest LTS version recommended, e.g., 18.x or 20.x)
*   npm (comes with Node.js) or yarn

### Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd mobile-ecommerce
    ```

2.  **Install dependencies:**
    Using npm:
    ```bash
    npm install
    ```
    Or using yarn:
    ```bash
    yarn install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    This will start the Vite development server, typically at `http://localhost:5173`. Open this URL in your browser.

### Available Scripts

*   `npm run dev`: Starts the development server.
*   `npm run build`: Builds the application for production.
*   `npm run lint`: Lints the codebase using ESLint.
*   `npm run preview`: Serves the production build locally for preview.

## Admin Access

The application includes a mock admin user for accessing the admin dashboard and management features.

*   **Admin Email:** `admin@mobile-store.com`
*   **Admin Password:** `password` (this is a hardcoded password for mock purposes in `AuthContext.tsx`)

Log in with these credentials to gain admin privileges. The admin dashboard link will appear in the user profile dropdown in the navbar.

## Project Structure

```
mobile-ecommerce/
├── public/                 # Static assets
├── src/
│   ├── assets/             # Images, fonts, etc.
│   ├── components/         # Reusable UI components (ui, layout, admin)
│   ├── contexts/           # React Context API for global state (Auth, Cart)
│   ├── data/               # Mock data (mockData.ts)
│   ├── pages/              # Page components (including admin sub-pages)
│   ├── services/           # Mock API service (mockApiService.ts)
│   ├── styles/             # Global styles (index.css)
│   ├── types/              # TypeScript type definitions
│   ├── App.tsx             # Main application component with routing
│   ├── main.tsx            # Entry point of the application
│   └── vite-env.d.ts       # Vite environment types
├── .eslintrc.cjs           # ESLint configuration
├── .gitignore              # Git ignore file
├── index.html              # Main HTML file
├── package.json            # Project metadata and dependencies
├── postcss.config.js       # PostCSS configuration
├── README.md               # This file
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
└── tsconfig.node.json      # TypeScript configuration for Node
└── vite.config.ts          # Vite configuration
```

## Mock API Service

All backend operations are simulated by `src/services/mockApiService.ts`. This service uses in-memory arrays initialized from `src/data/mockData.ts`. Data changes (like adding a product or placing an order) modify these in-memory arrays and do not persist if the application is restarted. This allows for a fully interactive frontend experience without requiring a live backend.

## Future Enhancements (Potential)

*   Implement a real backend (e.g., Node.js/Express, Firebase, Supabase).
*   More robust form validation.
*   Full payment gateway integration.
*   User profile management (update details, order history).
*   Advanced product filtering and sorting options.
*   Search functionality for orders and users in admin.
*   Unit and integration tests.