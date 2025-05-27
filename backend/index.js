// index.js or server.js
import mongoose from "mongoose";
import express from "express";
import http from "http";
import { DB_NAME } from "./constants.js";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
import  setupSocket  from "./socket.js"; // <-- WebSocket logic

dotenv.config({ path: "./.env" });

const PORT = process.env.PORT || 8000;

// Create HTTP server from Express app
const server = http.createServer(app);

// Attach Socket.IO to the server
setupSocket(server);

// Connect DB and start server
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`⚙️ Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed!", err);
  });
