// here we are importing the app and connecting to the database
// also defining some routes to test the server and database connection

import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./db/index.js";
import { initialTransactions } from "./data/transactions.js";

dotenv.config({ path: "./.env" });

const port = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.error("Server error: ", error);
    });

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection error ", error);
  });

// FOR TESTING PURPOSES ONLY, THIS ROUTE WILL BE DELETED LATER
app.get("/", (req, res) => {
  res.send("Server is running.");
});

// FOR TESTING PURPOSES ONLY, THIS ROUTE WILL BE DELETED LATER
app.get("/api/data", (req, res) => {
  res.json(initialTransactions);
});
