// routes/payments.js
const express = require('express');
const router = express.Router();
const db = require('../models/db'); // Assuming you're using a DB connection module

// Get all payments
router.get('/', async (req, res) => {
  try {
    const [rows, fields] = await db.query('SELECT * FROM payment');
    res.json(rows); // Send only the rows
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new payment
router.post('/', async (req, res) => {
  const { ReservationID, Amount, PaymentDate, PaymentMethod, PaymentStatus } = req.body;
  try {
    const newPayment = await db.query(
      'INSERT INTO payment (ReservationID, Amount, PaymentDate, PaymentStatus) VALUES (?, ?, ?, ?, ?)',
      [ReservationID, Amount, PaymentDate, PaymentStatus || 'pending']
    );
    res.status(201).json({ message: 'Payment created', paymentId: newPayment.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an existing payment
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { Amount, PaymentDate, PaymentStatus } = req.body;

  try {
    const updatedPayment = await db.query(
      'UPDATE payment SET  PaymentStatus = ? WHERE PaymentID = ?',
      [  PaymentStatus, id]
    );
    if (updatedPayment.affectedRows === 0) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json({ message: 'Payment updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
