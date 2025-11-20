const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Database Connection
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', require('./api/routes/authRoutes'));
app.use('/api/students', require('./api/routes/studentRoutes'));
app.use('/api/teachers', require('./api/routes/teacherRoutes'));
app.use('/api/attendance', require('./api/routes/attendanceRoutes'));
app.use('/api/analytics', require('./api/routes/analyticsRoutes'));
app.use('/api/quizzes', require('./api/routes/quizRoutes'));
app.use('/api/emergency', require('./api/routes/emergencyRoutes'));
app.use('/api/health', require('./api/routes/healthRoutes'));

// Health Check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Smart Classroom Watch API', 
    version: '1.0.0',
    status: 'running' 
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV}`);
});

module.exports = app;
