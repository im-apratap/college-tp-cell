import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes Import
// import userRouter from "./routes/user.routes.js";
// import adminRouter form "./routes/admin.routes.js"

// // Routes declaration
// app.use("/api/v1/users", userRouter);
app.use("/health",(req,res)=>{
    res.send("Working perfectly")
})

const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () => {
      console.log(`Server running on port ${ENV.PORT}`);
    });
  } catch (error) {
    console.log("Error connecting to Server", error);
    process.exit(1);
  }
};

startServer();