const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET all customers
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Customer');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET customer by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM Customer WHERE CustomerID = ?', [id]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: 'Customer not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST login
router.post('/login', async (req, res) => {
  const { Email, Password } = req.body;

  if (!Email || !Password) {
    return res.status(400).json({ error: 'Email and Password are required' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM Customer WHERE Email = ? AND Password = ?', [Email, Password]);
    if (rows.length > 0) {
      const customer = rows[0];
      res.json({ message: 'Login successful', customerId: customer.CustomerID });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// POST create a new customer
router.post('/', async (req, res) => {
  const { Email, Password, Name, Phone } = req.body;

  // Validate required fields
  if (!Email || !Password || !Name || !Phone) {
    return res.status(400).json({ error: 'Please provide all required fields: Email, Password, Name, Phone' });
  }

  try {
    const query = 'INSERT INTO Customer (Email, Password, Name, Phone) VALUES (?, ?, ?, ?)';
    const [result] = await db.query(query, [Email, Password, Name, Phone]);
    res.status(201).json({ message: 'Customer created', customerId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update an existing customer
router.put('/up/:id', async (req, res) => {
  const { id } = req.params;
  const { Email, Password, Name, Phone } = req.body;

  // Validate required fields
  if (!Email || !Password || !Name || !Phone) {
    return res.status(400).json({ error: 'Please provide all required fields: Email, Password, Name, Phone' });
  }

  try {
    const query = 'UPDATE Customer SET Email = ?, Password = ?, Name = ?, Phone = ? WHERE CustomerID = ?';
    const [result] = await db.query(query, [Email, Password, Name, Phone, id]);

    if (result.affectedRows > 0) {
      res.json({ message: 'Customer updated successfully' });
    } else {
      res.status(404).json({ error: 'Customer not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a customer
router.delete('/de/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const query = 'DELETE FROM Customer WHERE CustomerID = ?';
    const [result] = await db.query(query, [id]);

    if (result.affectedRows > 0) {
      res.json({ message: 'Customer deleted successfully' });
    } else {
      res.status(404).json({ error: 'Customer not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
