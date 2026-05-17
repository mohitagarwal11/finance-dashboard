# FinMo

A responsive full-stack personal finance dashboard. FinMo helps users review income and expenses, inspect spending patterns through charts, track monthly limits, and manage transactions from an authenticated account.

## Deployed Build

Live Demo: https://finmo-beryl.vercel.app/

## Screenshots

### Dashboard Overview(User)

![Dashboard overview for User](./assets/dashboard.png)

### Transaction Management(Admin)

![Transaction Section for Admin](./assets/transactions.png)

### Charts

![Charts/Stats](./assets/charts.png)

## Overview

FinMo is built with a React/Vite frontend and an Express/MongoDB backend. Users can register, log in, and manage their own transaction data. Authentication uses JWT access tokens sent as Bearer headers, with refresh-token rotation and HTTP-only cookies kept as a backend fallback for same-site deployments in future.

The interface is organized around a few core workflows:

- reviewing headline numbers like net balance, total income, and total expenses
- exploring monthly trends and category-wise spending with charts
- monitoring budget usage and monthly savings through quick insights
- searching, filtering, adding, editing, and deleting transactions
- switching between `user` and `admin` modes to change available dashboard actions

## Features

- User registration and login
- JWT Bearer authentication with refresh-token rotation
- MongoDB-backed transaction storage
- Summary cards for net balance, total income, and total expenses
- Interactive charts powered by Chart.js for:
  - monthly income vs expense trends(Line Chart)
  - expense distribution by category(Doughnut/Pie Chart)
- Insights panel showing:
  - month selector in User mode and configurable expense limit in Admin mode
  - monthly expense tracker
  - highest spending category for the selected month
  - monthly net savings
- Transaction list with filters for:
  - search by title
  - category
  - transaction type
- Admin-mode transaction management:
  - add new transactions
  - edit existing transactions
  - delete transactions
  - update the expense limit(Insights section)
- User/Admin mode switcher for permission-aware UI behavior
- Theme toggle with persisted light/dark preference

## Tech Stack

| Layer      | Technology                                  |
| ---------- | ------------------------------------------- |
| Frontend   | React, Vite                                 |
| Styling    | Tailwind CSS                                |
| Charts     | Chart.js, `react-chartjs-2`                 |
| API        | Express                                     |
| Database   | MongoDB, Mongoose                           |
| Auth       | JWT Bearer tokens, fallback cookies, bcrypt |
| Client API | Axios                                       |

## Getting Started

### Prerequisites

Make sure the following are installed:

- Node.js `18+` recommended
- npm
- A MongoDB connection string

### Installation

Clone the repository and install dependencies in both apps:

```bash
git clone <your-repo-url>
cd finance-dashboard

cd backend
npm install

cd ../frontend
npm install
```

### Backend Environment

Create `backend/.env` with the required backend configuration:

```env
PORT=8000
MONGODB_URL=<your-mongodb-connection-string>
DB_NAME=finmo_db
CORS_ORIGIN=http://localhost:5173
ACCESS_TOKEN_SECRET=<your-access-token-secret>
ACCESS_TOKEN_EXPIRY=1h
REFRESH_TOKEN_SECRET=<your-refresh-token-secret>
REFRESH_TOKEN_EXPIRY=30d
```

For deployment, set `CORS_ORIGIN` to the exact deployed frontend URL. The frontend sends auth through `Authorization` headers, while the backend still supports cookies as a fallback.

### Running Locally

Start the backend:

```bash
cd backend
npm run dev
```

Start the frontend in a separate terminal:

```bash
cd frontend
npm run dev
```

Vite will print a local URL, usually:

```bash
http://localhost:5173
```

The frontend dev server proxies `/api` requests to `http://localhost:8000`.

## API Routes

User routes are mounted under `/api/v1/users`:

- `POST /register`
- `POST /login`
- `POST /logout`
- `POST /refreshToken`

Transaction routes are mounted under `/api/v1/transactions` and require authentication:

- `GET /`
- `POST /`
- `GET /:id`
- `PATCH /:id`
- `DELETE /:id`

## How It Works

After login or registration, the backend returns access and refresh tokens in JSON and also sets HTTP-only cookies for fallback compatibility. The frontend stores the tokens locally, sends the access token in the `Authorization` header, and refreshes the list after create, update, and delete actions.

The frontend keeps a small amount of UI state in the browser, including the selected theme, auth tokens, and the current logged-in user for rendering. Transaction records are stored in MongoDB and are associated with the authenticated user.

The `user` and `admin` roles are currently UI modes:

- `user` can browse summaries, charts, insights, and transactions
- `admin` can additionally add, edit, delete transactions, and update the monthly expense limit

## Project Structure

```text
finance-dashboard/
|-- backend/
|   |-- package.json
|   \-- src/
|       |-- app.js
|       |-- server.js
|       |-- controllers/
|       |-- db/
|       |-- middlewares/
|       |-- models/
|       |-- routes/
|       |-- utils/
|       \-- data/
|-- frontend/
|   |-- index.html
|   |-- package.json
|   |-- vite.config.js
|   \-- src/
|       |-- App.jsx
|       |-- main.jsx
|       |-- index.css
|       |-- api/
|       |-- components/
|       |-- constants/
|       |-- pages/
|       |-- sections/
|       \-- utils/
\-- assets/
```

## Notes

- Currency values are formatted in Indian Rupees(`INR`).
- The backend sets secure cookies, so production should be served over HTTPS.
- Component styling is handled with Tailwind utility classes in JSX, while `index.css` keeps the Tailwind import and global theme variables.
