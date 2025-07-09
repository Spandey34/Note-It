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
  origin: 'http://localhost:5173', // frontend URL
  credentials: true
}));
app.use(cookieParser());

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

//-------------Deployment----------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname1,'.', 'Frontend', 'dist')));

  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname1, '.', 'Frontend', 'dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running successfully!');
  });
}