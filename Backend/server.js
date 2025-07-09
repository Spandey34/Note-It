import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoute from "./routes/userRoute.js";
import topicRoute from "./routes/topicRoute.js";
import linkRoute from "./routes/linkRoute.js";
import path from "path";

dotenv.config();
const app = express();
app.use(express.json());

// ✅ CORS setup to allow frontend access
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed for: " + origin));
    }
  },
  credentials: true
}));

// ✅ Routes
app.use("/user", userRoute);
app.use("/topics", topicRoute);
app.use("/links", linkRoute);

// ✅ Default route
app.use("/", (req, res) => {
  res.send("Welcome to Backend");
});

// ✅ Mongo + Server startup
const PORT = process.env.PORT || 4000;
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("MongoDB Connected!");
  app.listen(PORT, () => {
    console.log(`Server is running at PORT: ${PORT}`);
  });
});
