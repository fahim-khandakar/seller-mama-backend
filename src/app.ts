import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import expressSession from "express-session";
import passport from "passport";
import "./config/passport";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import { envVars } from "./config/env";
import { router } from "./app/routes";
import morgan from "morgan";

const allowedOrigins = [
  "https://sellermama.com",
  "https://www.sellermama.com",
  "http://localhost:3000",
];

const app = express();

app.use(
  expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
// app.use(express.json());
app.set("trust proxy", 1);
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(morgan("dev"));
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to Seller Mama Backend",
  });
});

app.use(globalErrorHandler);

app.use(notFound);

export default app;
