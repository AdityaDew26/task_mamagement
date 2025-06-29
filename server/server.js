import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';
import authRoutes from "./routes/authRoutes.js"
import taskRoutes from "./routes/taskRoutes.js"
import teamRoutes from './routes/teamRoutes.js';



dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes)

app.use('/api/tasks', taskRoutes);
app.use('/api/teams', teamRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
