const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB Database!'))
  .catch((err) => console.error('MongoDB connection error:', err));

const userRoutes = require('./routes/userRoutes');

// Basic API route
app.get('/', (req, res) => {
  res.send('Backend Server is Running! Access the frontend via the Vite dev server URL (usually http://localhost:5173).');
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is connected and running successfully!' });
});

app.use('/api/users', userRoutes);
const leaveRoutes = require('./routes/leaveRoutes');
app.use('/api/leaves', leaveRoutes);
const scholarshipRoutes = require('./routes/scholarshipRoutes');
app.use('/api/scholarships', scholarshipRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
