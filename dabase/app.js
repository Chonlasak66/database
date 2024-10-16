// app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import routes
const customerRoutes = require('./routes/customers');
const reservationRoutes = require('./routes/reservations');
const roomRoutes = require('./routes/rooms');
const paymentRoutes = require('./routes/payments');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Use the routes
app.use('/api/customers', customerRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/payments', paymentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
