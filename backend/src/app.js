// here we are creating the app and defining the routes and middlewares for the app
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// using cors middleware to allow cross-origin requests from the frontend
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

// using express json and urlencoded middleware to parse the request body and limit the size of the request body to 16kb to prevent DoS attacks
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb" }));

// using cookie parser middleware to parse the cookies from the request header and make it available in req.cookies
app.use(cookieParser());

// ROUTES IMPORT
import userRouter from "./routes/user.routes.js";
import transactionRouter from "./routes/transaction.routes.js";
import firebaseRouter from "./routes/firebase.routes.js";

// ROUTES DECLARATION
// this is used to for jwt routes like user info, settings related routes and refreshAccessToken
app.use("/api/v1/users", userRouter);
// this is used for all transaction related routes
app.use("/api/v1/transactions", transactionRouter);
// this is used for all firebase related routes like login, logout
app.use("/api/v1/auth", firebaseRouter);

// error handling middleware to catch any errors that might occur in the request handlers
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
    data: null,
  });
});

// health check route to keep render server running
app.get("/api/ping", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

export { app };
