import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import materialRoutes from './routes/materials.js';
import transactionRoutes from './routes/transactions.js';
import dashboardRoutes from './routes/dashboard.js';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/materials', materialRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/dashboard', dashboardRoutes);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, '../frontend/dist');

app.use('/api', (req, res) => res.status(404).json({ message: 'API route not found.' }));
app.use(express.static(distPath));
app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html'))); // React Router pages

// Central error handler
app.use((err, req, res, next) => {
  if (err.code === 11000) {
    return res.status(409).json({ message: 'A material with this code already exists.' });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: Object.values(err.errors)[0].message });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid id.' });
  }
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
  })
  .catch((e) => {
    console.error('DB connection failed:', e.message);
    process.exit(1);
  });
