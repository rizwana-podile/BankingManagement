require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { connectDB } = require('./config/db');
const seedData = require('./seed/seedData');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/accounts', require('./routes/accountRoutes'));
app.use('/api/transfers', require('./routes/transferRoutes'));
app.use('/api/beneficiaries', require('./routes/beneficiaryRoutes'));
app.use('/api/cards', require('./routes/cardRoutes'));
app.use('/api/loans', require('./routes/loanRoutes'));
app.use('/api/fds', require('./routes/fdRoutes'));
app.use('/api/bills', require('./routes/billRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/staff', require('./routes/staffRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Public Health & Credentials endpoint for seamless 1-click evaluation
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    bank: 'Aura Apex Bank',
    system: 'Enterprise Core Banking System',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/demo-users', (req, res) => {
  res.json({
    success: true,
    credentials: [
      {
        role: 'Customer (Primary)',
        name: 'Rahul Sharma',
        email: 'rahul.sharma@example.com',
        password: 'Customer@123',
        description: 'Complete profile with Savings & Salary accounts, cards, loans, FDs, and transactions'
      },
      {
        role: 'Customer (Secondary)',
        name: 'Priya Patel',
        email: 'priya.patel@example.com',
        password: 'Customer@123',
        description: 'Useful for testing inter-customer real-time money transfers'
      },
      {
        role: 'Staff / Branch Officer',
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@auraapex.com',
        password: 'Staff@123',
        description: 'Manages KYC approval queue, loan disbursement, accounts, and transaction monitoring'
      },
      {
        role: 'System Administrator',
        name: 'Vikramaditya Singhania',
        email: 'admin@auraapex.com',
        password: 'Admin@123',
        description: 'Bank-wide analytics charts, user management, branch configuration, audit logs, and broadcasts'
      }
    ]
  });
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await seedData();

    app.listen(PORT, () => {
      console.log(`==================================================`);
      console.log(`   AURA APEX BANK - CORE BANKING API SERVER`);
      console.log(`   Listening on: http://localhost:${PORT}`);
      console.log(`   Health:       http://localhost:${PORT}/api/health`);
      console.log(`   Demo Logins:  http://localhost:${PORT}/api/demo-users`);
      console.log(`==================================================`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

module.exports = app;
