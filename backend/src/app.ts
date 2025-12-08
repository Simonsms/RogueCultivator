import express from "express";
import cors from "cors";
import helmet from "helmet";
// config removed - no auth needed
import routes from "./routes";
import { errorHandler, notFound } from "./middlewares/errorHandler";

const app = express();

// Security middleware
app.use(helmet());

// CORS - 允许所有来源（包括 file:// 协议）
app.use(
  cors({
    origin: true, // 允许所有来源
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api", routes);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
