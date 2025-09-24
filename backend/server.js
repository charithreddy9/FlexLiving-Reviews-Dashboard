const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const reviewsRoutes = require('./routes/reviews');
const googleReviewsRoutes = require('./routes/googleReviews');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple admin access middleware for manager routes
const reviewsAccessGuard = (req, res, next) => {
  const required = process.env.ADMIN_ACCESS_CODE;
  if (!required) return next();
  const provided = req.header('X-ADMIN-KEY');
  if (provided && provided === required) return next();
  return res.status(401).json({ success: false, error: 'Unauthorized' });
};

// Routes
app.use('/api/reviews', reviewsAccessGuard, reviewsRoutes);
app.use('/api/google-reviews', googleReviewsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Flex Living Reviews API'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(` Flex Living Reviews API server running on port ${PORT}`);
  console.log(` Health check: http://localhost:${PORT}/api/health`);
});