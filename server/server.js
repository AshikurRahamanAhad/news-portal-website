import express from 'express';
import 'dotenv/config'; // <-- Load dotenv synchronously before other imports!
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import newsRoutes from './routes/newsRoutes.js';

// Connecting to the MongoDB Database
connectDB();

const app = express();

// CORS and JSON body parsing middleware
app.use(cors());
app.use(express.json());

// API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);

// Root Endpoint
app.get('/', (req, res) => {
  res.send('News Portal API is running...');
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;