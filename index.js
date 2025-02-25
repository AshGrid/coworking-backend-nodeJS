const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const tablesRouter = require('./routes/tables');
const chairsRouter = require('./routes/chairs');
const roomRoutes = require('./routes/room');

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/tables', tablesRouter);
app.use('/chairs', chairsRouter);
app.use('/rooms', roomRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Tables Management API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});