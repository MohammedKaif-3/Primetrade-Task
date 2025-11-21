import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import taskRouter from './routes/taskRoutes.js';

const app = express();
const port = process.env.PORT || 4000;
connectDB();

const allowedOrigins = ['http://localhost:5173']

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(cookieParser());


// API EndPoints
app.get('/', (req, res) => {
  res.send("API Working")
})

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/tasks', taskRouter)

app.listen(port, () => {
  console.log("Server is running on " + port);
})