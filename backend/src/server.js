import dotenv from "dotenv";
dotenv.config();
import { fileURLToPath } from "url";

import express from "express";
import cors from "cors";
import foodRouter from "./routers/food.router.js";
import userRouter from "./routers/user.router.js";
import orderRouter from "./routers/order.router.js";
import uploadRouter from "./routers/upload.router.js";
import chatRouter from "./routers/chat.router.js";
// import restaurantRouter from "./routers/restaurant.router.js"; // Removed import

import { dbConnect } from "./config/database.config.js";
import path from "path";
import { dirname } from "path";

dbConnect();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"], // For development, may need adjustment for production
  })
);

app.use("/api/foods", foodRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/chat", chatRouter);
// app.use("/api/restaurants", restaurantRouter); // Removed usage

// --- Serve Frontend Build ---
// Calculate path to frontend build directory relative to backend/src
const frontendBuildPath = path.join(__dirname, "../../frontend/build");
app.use(express.static(frontendBuildPath));

// For any other request, serve the index.html from the build folder
app.get("*", (req, res) => {
  const indexFilePath = path.join(frontendBuildPath, "index.html");
  res.sendFile(indexFilePath);
});
// --- End Serve Frontend Build ---

const PORT = process.env.PORT || 5000;
app
  .listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  })
  .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`Port ${PORT} is already in use.`);
    } else {
      console.error(err);
    }
  });
