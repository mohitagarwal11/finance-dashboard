# FinMo

A responsive full-stack personal finance dashboard built with React, Vite, Express, and MongoDB. FinMo helps users review income and expenses, inspect spending patterns through interactive charts, track monthly budgets, and manage transactions from a secure authenticated account.

## Live Demo

**Deployed Build:** https://finmo-beryl.vercel.app/

## Screenshots

### Dashboard Overview

![Dashboard overview](./assets/dashboard.png)

### Transaction Management

![Transaction Section](./assets/transactions.png)

### Charts & Analytics

![Charts/Stats](./assets/charts.png)

## Overview

FinMo is a full-stack personal finance management application that allows users to register, log in securely, and manage their transaction data. The application uses:

- **Frontend:** React with Vite for fast development and production builds
- **Backend:** Express.js REST API with MongoDB for data persistence
- **Authentication:** JWT Bearer tokens with refresh-token rotation, HTTP-only cookies as fallback
- **Security:** Password hashing with bcrypt, CORS-enabled for cross-origin requests

### Core Workflows

- **Summary Dashboard:** View headline metrics (net balance, total income, total expenses)
- **Analytics:** Explore monthly trends and category-wise spending through interactive charts
- **Budget Tracking:** Monitor monthly expense limits and savings goals
- **Transaction Management:** Search, filter, create, edit, and delete transactions

## Features

### Authentication & User Management

- User registration and login with email validation
- JWT Bearer authentication with automatic token refresh
- HTTP-only cookie fallback for same-site deployments
- Secure password hashing with bcrypt (minimum 8 characters)
- User profile and settings management
- Account deletion capability

### Transaction Management

- Full CRUD operations for transactions (Create, Read, Update, Delete)
- Transaction categorization:
  - **Expense categories:** Food, Rent, Transportation, Utilities, Entertainment
  - **Income categories:** Salary, Investment
- Advanced filtering:
  - Search by transaction title
  - Filter by category
  - Filter by transaction type (income/expense)
- Date-based transaction organization

### Dashboard Analytics

- **Summary Cards:**
  - Net balance (Income - Expenses)
  - Total income across all transactions
  - Total expenses across all transactions

- **Interactive Charts:**
  - Line chart showing monthly income vs. expense trends
  - Doughnut/Pie chart displaying expense distribution by category

- **Insights Panel:**
  - Month selector for filtered analysis
  - Configurable monthly expense limit
  - Monthly expense tracking with visual indicators
  - Highest spending category identification
  - Monthly net savings calculation

### User Experience

- Light/dark theme toggle with persistent user preference
- Responsive design optimized for desktop, tablet, and mobile
- Pagination for transaction lists
- Real-time UI updates on transaction changes

## Tech Stack

| Layer              | Technology                             |
| ------------------ | -------------------------------------- |
| **Frontend**       | React 19, Vite 8                       |
| **Styling**        | Tailwind CSS 4.2, Tailwind Vite Plugin |
| **Charts**         | Chart.js 4.5, react-chartjs-2 5.3      |
| **Routing**        | React Router DOM 6.30                  |
| **Backend API**    | Express 5.2                            |
| **Database**       | MongoDB 9.6, Mongoose 9.6              |
| **Authentication** | JWT (jsonwebtoken 9.0), bcrypt 6.0     |
| **HTTP Client**    | Axios 1.16                             |
| **Middleware**     | CORS, cookie-parser                    |
| **Dev Tools**      | ESLint, Nodemon                        |

## How It Works

### Authentication Flow

1. **User Registration/Login:**
   - User submits credentials to `/api/v1/users/register` or `/api/v1/users/login`
   - Backend validates credentials and generates JWT access token (1h expiry) and refresh token (30d expiry)
   - Tokens are returned in JSON response and set as HTTP-only cookies (for fallback)

2. **Token Storage:**
   - Frontend stores tokens in `localStorage` via `tokenStore.js`
   - User data (username, email, displayName, expenseLimit) is also stored locally

3. **Authenticated Requests:**
   - All subsequent API requests include the access token in the `Authorization: Bearer <token>` header
   - Backend middleware (`auth.middleware.js`) verifies the token before processing requests

4. **Token Refresh:**
   - When access token expires, frontend automatically requests a new one using the refresh token
   - This is handled by the `setAuthExpiredHandler` in the API client
   - New tokens are issued without requiring user to log in again

### Data Flow

1. **Transaction CRUD Operations:**
   - All transactions are associated with the authenticated user via `user._id` MongoDB ObjectId
   - When transactions are created/updated/deleted, the frontend automatically refreshes the list
   - Transactions are sorted by date (newest first) in responses

2. **UI State Management:**
   - User authentication state is stored in React state and synced to localStorage
   - Transaction list is maintained in component state and updated after each operation
   - Theme preference (light/dark) persists via localStorage

### Security Considerations

- Passwords are hashed using bcrypt (10 salt rounds) before storage
- JWT tokens are signed with strong secrets
- HTTP-only cookies prevent XSS attacks from accessing tokens
- CORS is configured to only accept requests from authorized frontend origin
- Request body size is limited to 16KB to prevent DoS attacks
- Authentication middleware protects sensitive endpoints

## Project Structure

```text
finance-dashboard/
├── README.md                          # Project documentation
├── assets/                            # Project screenshots and images
│   ├── dashboard.png
│   ├── transactions.png
│   └── charts.png
│
├── backend/                           # Express.js REST API
│   ├── package.json                   # Backend dependencies
│   └── src/
│       ├── app.js                     # Express app setup, routes, middleware
│       ├── server.js                  # Server startup and DB connection
│       ├── controllers/               # Business logic for routes
│       │   ├── user.controller.js    # Auth, registration, user management
│       │   └── transaction.controller.js # Transaction CRUD operations
│       ├── models/                    # Mongoose schemas
│       │   ├── user.models.js        # User schema with JWT methods
│       │   └── transaction.models.js # Transaction schema
│       ├── routes/                    # API route definitions
│       │   ├── user.routes.js        # User/auth endpoints
│       │   └── transaction.routes.js # Transaction endpoints
│       ├── middlewares/               # Custom middleware
│       │   └── auth.middleware.js    # JWT verification middleware
│       ├── db/                        # Database configuration
│       │   └── index.js              # MongoDB connection
│       └── utils/                     # Utility functions
│           ├── ApiError.js           # Custom error class
│           ├── ApiResponse.js        # Standardized response format
│           └── asyncHandler.js       # Async error handling wrapper
│
├── frontend/                          # React + Vite application
│   ├── package.json                   # Frontend dependencies
│   ├── vite.config.js                 # Vite configuration
│   ├── eslint.config.js               # ESLint rules
│   ├── vercel.json                    # Vercel deployment config
│   ├── index.html                     # HTML entry point
│   ├── public/                        # Static assets
│   └── src/
│       ├── main.jsx                   # React app entry point
│       ├── App.jsx                    # Main app component with routing
│       ├── index.css                  # Global styles and theme variables
│       ├── api/                       # API client and utilities
│       │   ├── client.js             # Axios instance with interceptors
│       │   ├── auth.js               # Authentication API calls
│       │   ├── transactions.js       # Transaction API calls
│       │   └── tokenStore.js         # LocalStorage token management
│       ├── pages/                     # Page components (routes)
│       │   ├── AuthPage.jsx          # Login/Registration page
│       │   ├── DashboardPage.jsx     # Main dashboard with all sections
│       │   └── SettingsPage.jsx      # User settings page
│       ├── sections/                  # Dashboard sections (reusable layouts)
│       │   ├── SummarySection.jsx    # Summary cards (balance, income, expenses)
│       │   ├── ChartsSection.jsx     # Chart visualizations
│       │   ├── InsightsSection.jsx   # Insights and budget tracking
│       │   └── TransactionsSection.jsx # Transaction list and management
│       ├── components/                # Reusable UI components
│       │   ├── SummaryCard.jsx       # Individual summary card
│       │   ├── TransactionItem.jsx   # Single transaction row
│       │   ├── AddTransactionModal.jsx # Modal for adding transactions
│       │   └── Pagination.jsx        # Pagination controls
│       ├── constants/                 # Application constants
│       │   └── categories.js         # Expense/income categories
│       └── utils/                     # Utility functions
│           ├── formatters.js         # Currency and date formatting
│           └── reducers.js           # React reducers for data aggregation
│
└── OLD.stuff/                         # Legacy/archived code
```

## Notes

- **Currency Format:** All monetary values are formatted in Indian Rupees (₹/INR)
- **Future Enhancements:**
  - Transaction export (CSV/PDF)
  - Data visualization improvements
  - Mobile app using React Native
