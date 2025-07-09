import express, { urlencoded } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js"
import topicRoute from "./routes/topicRoute.js"
import linkRoute from "./routes/linkRoute.js"
import path from "path";

dotenv.config()
const app = express();
app.use(express.json());
app.use(cors({
  origin: `${process.env.FRONTEND_URL}`, // frontend URL
  credentials: true
}));
app.use(cookieParser());

app.use("/",(req,res) => {
  res.send("Backend is running!!");
})

app.use("/user", userRoute);
app.use("/topics", topicRoute);
app.use("/links", linkRoute);


const PORT = process.env.PORT || 4000;
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDb Connected!");
    app.listen(PORT, () => {
        console.log(`Server is running at PORT: ${PORT}`)
    })
})
