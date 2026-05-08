import express, { Application, Request, Response } from "express";
import cors from "cors"
import path from "path";
import "dotenv/config"; 

import compnayRoutes from "./routes/auth/auth.routes";
import otpRouter from "./routes/otp-routes/mobile.otp.routes"



// Create express app
const app: Application = express();

// Middlewares
app.use(express.json()); // Parse JSON
app.use(express.urlencoded({ extended: true })); 
app.use(cors());

// Static files (for uploads/public folder)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(express.static(path.join(__dirname, "../public")));
// Routes

app.use(`${process.env.API_PREFIX}/`, compnayRoutes);
app.use(
  `${process.env.API_PREFIX}/forget-password`,
  //adminProtecter,
  otpRouter,
);


// Health check route
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "OK" });
});







export default app;

