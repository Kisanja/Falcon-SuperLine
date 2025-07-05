//username - kisanja44
//password - 6RFXY6TK4WDXWKr7

const express = require('express');
const cors = require('cors');
const { db } = require('./db/db');
const busRoutes = require('./routes/busRoutes');
const routeRoutes = require('./routes/routeRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const financeRoutes = require('./routes/financeRoutes');
const customerRoutes = require('./routes/customerRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB
db();

// Routes
app.use('/api/buses', busRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/bookings', bookingRoutes);

// Root test route
app.get('/', (req, res) => {
  res.send('Bus Management Backend is running...');
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
});
