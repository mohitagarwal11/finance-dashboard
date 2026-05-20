# FinMo

A responsive full-stack personal finance dashboard built with React, Vite, Express, MongoDB and Firebase Auth. FinMo helps users review income and expenses, inspect spending patterns through interactive charts, track monthly budgets, and manage transactions from a secure authenticated account.

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

- Firebase email/password authentication with email verification
- Google sign-in via Firebase OAuth
- Backend Firebase ID token verification and JWT session tokens
- Automatic access token refresh with HTTP-only cookie fallback
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
| **Frontend**       | React, Vite                            |
| **Styling**        | Tailwind CSS, Tailwind Vite Plugin     |
| **Charts**         | Chart.js, react-chartjs-2              |
| **Routing**        | React Router DOM                       |
| **Backend API**    | Express                                |
| **Database**       | MongoDB, Mongoose                      |
| **Authentication** | Firebase Auth, JWT                     |
| **HTTP Client**    | Axios 1.16                             |
| **Middleware**     | CORS, cookie-parser                    |
| **Dev Tools**      | ESLint, Nodemon                        |

## How It Works

### Authentication Flow

1. **Firebase Sign-In:**
   - User signs in with Firebase email/password or Google
   - Frontend receives a Firebase ID token

2. **Token Storage:**
   - Frontend sends the Firebase ID token to `/api/v1/auth/firebase`
   - Backend verifies it and issues JWT access/refresh tokens
   - Access token is stored in `localStorage` via `tokenStore.js`

3. **Authenticated Requests:**
   - API requests include the access token in the `Authorization: Bearer <token>` header
   - Backend middleware (`auth.middleware.js`) verifies the token before processing requests

4. **Token Refresh:**
   - When access token expires, the API client calls `/api/v1/users/refreshToken`
   - New tokens are issued without requiring the user to log in again

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

- Firebase Auth manages credential storage and verification
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
│       ├── config/
│       │   └── firebaseAdmin.js       # Firebase Admin initialization
│       ├── controllers/               # Business logic for routes
│       │   ├── firebase.controller.js # Firebase auth exchange
│       │   ├── user.controller.js     # User session + settings
│       │   └── transaction.controller.js # Transaction CRUD operations
│       ├── models/                    # Mongoose schemas
│       │   ├── user.models.js         # User schema with JWT methods
│       │   └── transaction.models.js  # Transaction schema
│       ├── routes/                    # API route definitions
│       │   ├── firebase.routes.js     # Firebase auth endpoints
│       │   ├── user.routes.js         # User endpoints
│       │   └── transaction.routes.js  # Transaction endpoints
│       ├── middlewares/               # Custom middleware
│       │   ├── auth.middleware.js     # JWT verification middleware
│       │   └── firebase.middleware.js # Firebase token verification
│       ├── db/                        # Database configuration
│       │   └── index.js               # MongoDB connection
│       └── utils/                     # Utility functions
│           ├── ApiError.js            # Custom error class
│           ├── ApiResponse.js         # Standardized response format
│           └── asyncHandler.js        # Async error handling wrapper
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
│       │   ├── AuthPage.jsx           # Login/Registration page
│       │   ├── DashboardPage.jsx      # Main dashboard with all sections
│       │   └── SettingsPage.jsx       # User settings page
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
│       ├── contexts/                  # Auth + transactions state
│       │   ├── AuthContext.jsx        # Auth provider
│       │   └── TransactionsContext.jsx # Transactions provider
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
