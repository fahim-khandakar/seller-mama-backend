import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { connectDB } from "./DB/db";
import { PORT } from "./shared/config/secrets";
import rootRoutes from "./routes/rootRoutes";
import { errorHandler } from "./shared/helpers/errorHandler";

// Load environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1", rootRoutes);
app.use(errorHandler);

// Connect Database and Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
